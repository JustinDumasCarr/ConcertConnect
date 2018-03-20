const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const cors = require('cors');
const logger = require('morgan');
const passport = require('passport');
const mongoose = require('mongoose');
const config = require('./config/database');
var jwt = require('jsonwebtoken');
const User = require('./models/user');
const Message = require('./models/message');




// Connect To Database
mongoose.connect(config.database);

// On Connection
mongoose.connection.on('connected', () => {
  console.log('Connected to database '+config.database);
});

// On Error
mongoose.connection.on('error', (err) => {
  console.log('Database error: '+err);
});

const app = express();

const users = require('./routes/users');

// Port Number
const port = 3000;

// CORS Middleware
app.use(cors());

// Set Static Folder
app.use(express.static(path.join(__dirname, 'public')));

// Body Parser Middleware
app.use(logger('dev'));
app.use(bodyParser.json());

// Passport Middleware
app.use(passport.initialize());
app.use(passport.session());


require('./config/passport')(passport);

app.use('/users', users);

// Index Route
app.get('/', (req, res) => {
  res.send('Invalid Endpoint');
});

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'public/index.html'));
});

// Start Server

var server = app.listen(port, () => {
    console.log('Server started on port ' + port);
});


app.post("/listFriends", async function(req, res){

    var userMap = new Map(); //to map usernames to multiple socket.id s   if needed
    var usersCollection = []; //for ng-chat friend-list

    UsersCollectionMongo = await User.find({});
    console.log(UsersCollectionMongo);

    UsersCollectionMongo.forEach(user => {
        console.log(user);
        usersCollection.push({
            id: user.username, // Assigning the socket ID as the user ID in this example
            displayName: user.username,
            status: 0, // ng-chat UserStatus.Online,
            avatar: null
        })
    });

    var clonedArray = usersCollection.slice();

    // Getting the userId from the request body as this is just a demo
    // Ideally in a production application you would change this to a session value or something else
   var i = usersCollection.findIndex(x => x.id == req.body.userId);
    clonedArray.splice(i,1);
    res.json(clonedArray);
});


app.post("/getMessages", async function(req, res){

    //messages must be an array of messages of type :
    // { fromId: any;
    //   toId: any;
    //   message: string;
    //   seenOn?: Date;
    //  }
    try {

        let messageArray = await Message.find({'fromId': [req.body.toId, req.body.fromId], 'toId': [req.body.fromId, req.body.toId]},{ toId: 1, fromId: 1,message:1, seenOn:1, _id:0 });
      // let messageArrayRecieved = await Message.find({'toId': req.body.fromId, 'fromId': req.body.toId},{ toId: 1, fromId: 1,message:1, seenOn:1, _id:0});
       //let messageArray = messageArraySent.concat(messageArrayRecieved);
        res.json({messageArray});
        console.log(messageArray);
    }
    catch(e){
        res.json({success:false});
        console.log(e);
    }
});

var io = require('socket.io').listen(server);
var socketioJwt = require('socketio-jwt');

// Socket.io operations

// io.sockets
//     .on('connection', socketioJwt.authorize({
//         secret: 'SECRET_KEY',
//         timeout: 15000 // 15 seconds to send the authentication message
//     })).on('authenticated', function(socket) {
//     //this socket is authenticated, we are good to handle more events from it.
//
//
//
//     console.log('hello! ' + socket.decoded_token.name);
// });


io.on('connection', async function(socket) {
    //every tab/window is a different connection
    console.log('A user has connected to the server.');

    var userMap = new Map(); //to map usernames to multiple socket.id s   if needed
    var usersCollection = []; //for ng-chat friend-list

        UsersCollectionMongo = await User.find({});


        UsersCollectionMongo.forEach(user => {

            usersCollection.push({
                id: user.username, // Assigning the socket ID as the user ID in this example
                displayName: user.username,
                status: 0, // ng-chat UserStatus.Online,
                avatar: null
            })
        });

    //socket.broadcast.emit("friendsListChanged", usersCollection);

    socket.on('join', function(jwtToken) {

        //check who the socket belongs too
        if(jwtToken) {
            var decoded = jwt.verify(jwtToken.slice(4), config.secret);
            var username = decoded.username;
            //using the username as an id temporarily
            socket.emit("generatedUserId", username);
        }
        //check if the user has different sockets open
        //user map is a map linking username and sockets
        if(userMap.has(username)){
           // usermap.set(username, usermap.get(username).push(socket.id));
        }
        else{
            // userMap.set(username, socket.id);
            // usersCollection.push({
            //     id: username, // Assigning the socket ID as the user ID in this example
            //     displayName: username,
            //     status: 0, // ng-chat UserStatus.Online,
            //     avatar: null
            // });
            // console.log(usersCollection);

            socket.broadcast.emit("friendsListChanged", usersCollection);
        }


        // room is the username, all sockets join the same room to receive the same messages (multiple tabs for same user)
        socket.on('room', room => {
            socket.join(room);
            console.log('Server joined room...', room);
        });

        // On disconnect remove this socket from the map and if no other sockets, remove from
        socket.on('disconnect', function() {
            console.log('User disconnected!');


          //  var i = usersCollection.findIndex(x => x.id == socket.id);
          //  usersCollection.splice(i, 1);

           // socket.broadcast.emit("friendsListChanged", usersCollection);
        });
    });

    socket.on("sendMessage", function(messagePayload){
        console.log("Message received:");
        console.log(messagePayload);



        let newMessage = new Message({
            toId : messagePayload.message.toId,
            fromId: messagePayload.message.fromId,
            message: messagePayload.message.message,
            seenOn: new Date()
        });
        newMessage.save((callback)=>{
            console.log(callback);
        });

        io.sockets.in(messagePayload.message.toId).emit('messageReceived',{
            user: {
                id: messagePayload.message.fromId, // Assigning the socket ID as the user ID in this example
                displayName: messagePayload.message.fromId,
                status: 0, // ng-chat UserStatus.Online,
                avatar: null
            },
            message: messagePayload.message
        });
        // io.to(message.toId).emit("messageReceived", {
        //     user: usersCollection.find(x => x.id == message.fromId),
        //     message: message
        // });

        console.log("Message dispatched.");
    });
});