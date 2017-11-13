const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const config = require('../config/database');


// User Schema
const UserSchema = mongoose.Schema({
  name: {
    type: String
  },
  email: {
    type: String,
    required: true
  },
  username: {
    type: String,
    required: true
  },
  password: {
    type: String,
    required: true
  },

  type: {
      type:String,
      required: true
  },

    //Not sure if I need to add a reference here, for now the name of the artist is simply in a string with no reference to anything
  artists: [{
    artistId:{type: mongoose.Schema.ObjectId, ref: 'Artist' }, name:{type: String}, type: {type:String}
  }],

  venues: [{
      venueId: {type: mongoose.Schema.ObjectId, ref: 'Venue'}, name: {type:String}, type: {type:String}
  }]
});

const User = module.exports = mongoose.model('User', UserSchema);

module.exports.getUserById = function(id, callback){
  User.findById(id, callback);
};

module.exports.getUserByUsername = function(username, callback){
  const query = {username: username};
  User.findOne(query, callback);
};

module.exports.getUserByEmail = function(email, callback)
{
    const query = {email: email};
    User.findOne(query,callback);
};

module.exports.addUser = function(newUser, callback){
  bcrypt.genSalt(10, (err, salt) => {
    bcrypt.hash(newUser.password, salt, (err, hash) => {
      if(err) throw err;
      newUser.password = hash;
      newUser.save(callback);
    });
  });
};

module.exports.changeUsername = function(userInfo, callback){

    User.update({username: userInfo.currUsername}, {
        username: userInfo.username
    }, callback);
};

module.exports.changeEmail = function (userInfo,callback) {
    User.update({email: userInfo.currentEmail},
        {
            email: userInfo.email
        }, callback)

};

//changing the artist name
module.exports.changeArtistName = function (userInfo,callback) {
    User.update({'artists.name': userInfo.currentName},{
        '$set': {
            'artists.$.name': userInfo.name
        }}, callback)

};

module.exports.changeArtistNameByID = function (userInfo,callback) {
    User.update({'artists.artistId': userInfo._id},{
        '$set': {
            'artists.$.name': userInfo.name
        }}, callback)
};

//Changing the artist email//changing the artist name
module.exports.changeArtistEmail = function (userInfo,callback) {
    User.update({'artists.email': userInfo.currentEmail},{
        '$set': {
            'artists.$.email': userInfo.email
        }}, callback)

};

// Changing venue name
module.exports.changeVenueName = function (userInfo,callback) {
    User.update({'venues.name': userInfo.currentName},{
        '$set': {
            'venues.$.name': userInfo.name
        }}, callback)

};

module.exports.changeVenueNameByID = function (userInfo,callback) {
    User.update({'venues.venueId': userInfo._id},{
        '$set': {
            'venues.$.name': userInfo.name
        }}, callback)
};

module.exports.comparePassword = function(candidatePassword, hash, callback){
  bcrypt.compare(candidatePassword, hash, (err, isMatch) => {
    if(err) throw err;
    callback(null, isMatch);
  });
};
