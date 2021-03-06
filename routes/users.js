const express = require('express');
const router = express.Router();
const passport = require('passport');
const jwt = require('jsonwebtoken');
const config = require('../config/database');
const User = require('../models/user');
const artists = require('./artists');
const venues = require('./venues');
const Artist = require('../models/artist');
const Venue = require('../models/venue');
const async = require('async');
const aws = require('aws-sdk');
const Controller = require('../controllers/controller');
const bcrypt = require('bcryptjs');

const S3_BUCKET = process.env.S3_BUCKET;


const nodemailer = require('nodemailer');
const xoauth2 = require('xoauth2');

var transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        type: 'OAuth2',
        user: 'justin.dumas.carr@gmail.com',
        clientId: '396125911536-f6kvm72e7j9er8sdgeu1nvjulbb39dst.apps.googleusercontent.com',
        clientSecret: 'TVrjamutn2nnMSZQkQ64jJGa',
        refreshToken: '1/RTMmbkDRN6WvDlLh2TPMyYmeaJhCrY-91GBixp6TLB0',
        accessToken: 'ya29.Glv_BCs-07UheV7gawhG6CcjViPBQF58IRQsxLOXDwliQXk9TqvNBj3r1vac4SOzQPZqYD5afaLREajWegd3O4g7dxwAzWAaIgC7Ym94qpRVk6H_kwJ5xZbOV10z'

    }
});

// const transporter = nodemailer.createTransport({
//     service: 'gmail',
//     auth: {
//         type: 'OAuth2',
//         user: serverConfig.gmail.client_user,
//         clientId: serverConfig.gmail.client_id,
//         clientSecret: serverConfig.gmail.secret,
//         refreshToken: serverConfig.gmail.refresh_token,
//         accessToken: serverConfig.gmail.access_token,
//     },
// });


router.use('/artists', artists);
router.use('/venues', venues);

router.post('/message', passport.authenticate('jwt', {session: false}), (req, res, next) => {
    let profileLink = '';

    if (req.body.type === 'venue') {

        profileLink = '/venue/' + req.body.venueId;
    }
    else {

        profileLink = '/artist/' + req.body.artistId;

    }
    var mailOptions = {
        from: req.body.from,
        to: req.body.to,
        subject: 'Nodemailer test',
        text: req.body.description + "   " + 'http://localhost:4200' + profileLink
    };

    transporter.sendMail(mailOptions, function (err, res) {
        if (error) {
            res.json({success: false, msg: 'Mail Not Sent'});
        } else {
            res.json({success: true, msg: 'Mail Sent'});
        }
    })

});


router.post('/register', (req, res, next) => {
    let newUser = new User({
        name: req.body.name,
        email: req.body.email,
        username: req.body.username,
        password: req.body.password,
        type: 'user'
    });

    User.addUser(newUser, (err, user) => {
        if (err) {
            res.json({success: false, msg: 'Failed to register user'});
        } else {
            res.json({success: true, msg: 'User registered'});
        }
    });
});

// Authenticate
router.post('/authenticate', async (req, res, next) => {

    const username = req.body.username;
    const password = req.body.password;


    // Try turning this into JSON testing
    let user = await User.findOne({'username': username});
    if(user) {
        // Test the user object to see what format comes out
        console.log("User has been found successfully");
        console.log("User Testing: ");
        console.log(user);
    }
    if (!user) {
        return res.json({success: false, msg: 'User not found'});
    }
    let passwordMatch = await bcrypt.compare(password, user.password);
    if(passwordMatch){
        const token = jwt.sign(user.toJSON(), config.secret, {
                             expiresIn: 604800 // 1 week
                         });
        let userArtistsAndVenues = await Controller.getUserArtists(user);
        console.log('userArtistsAndVenues: ' +JSON.stringify(userArtistsAndVenues));
        res.json({
                    success: true,
                    token: 'JWT ' + token,
                    user: {
                        _id: user._id,
                        name: user.name,
                        type: user.type,
                        username: user.username,
                        email: user.email,
                        venues: userArtistsAndVenues.venues,
                        artists: userArtistsAndVenues.artists
                    }
                });

    }
    else{
        res.json({success: false, msg: 'Wrong password'});
    }

});

// Profile
router.get('/profile', passport.authenticate('jwt', {session: false}), (req, res, next) => {
    res.json({user: req.user});
});


//Change username
router.post('/changeusername', passport.authenticate('jwt', {session: false}), (req, res, next) => {

    //This variable will not be used if user already exists
    const userInfo =
        {
            username: req.body.username,
            currUsername: req.body.currentUsername
        };


    //Checks if username exists
    User.getUserByUsername(userInfo.username, (err, user) => {
        if (err) throw err;
        if (user) {
            return res.json({success: false, msg: 'Username already exists'});
        }
        else {
            User.changeUsername(userInfo, (err, callback) => {
                if (callback) {
                    console.log(callback);
                    return res.json({success: true, msg: 'Username has been changed successfully'});
                }

            });
        }


    });

});

//Change email
router.post('/changeemail', passport.authenticate('jwt', {session: false}), (req, res, next) => {

    //This variable will not be used if user already exists
    const userInfo = {
        email: req.body.email,
        currentEmail: req.body.currentEmail
    };

    //Checks if email exists
    User.getUserByEmail(userInfo.email, (err, user) => {
        if (err) throw err;
        if (user) {
            return res.json({success: false, msg: 'Email already exists'});
        }
        else {
            User.changeEmail(userInfo, (err, callback) => {
                if (callback) {
                    console.log(callback);
                    return res.json({success: true, msg: 'Email has been changed successfully'});
                }
            });
        }
    });
});


//Change email
router.post('/changeusernamandemail', passport.authenticate('jwt', {session: false}), (req, res, next) => {

    //This variable will not be used if user already exists
    const userInfo = {
        email: req.body.email,
        currentEmail: req.body.currentEmail,
        username: req.body.username,
        currUsername: req.body.currentUsername
    };

    //Checks if email exists
    User.getUserByEmail(userInfo.email, (err, user) => {
        if (err) throw err;
        if (user) {
            return res.json({success: false, msg: 'Email already exists'});
        }
        else {
            User.changeEmail(userInfo, (err, callback) => {
                if (callback) {
                    console.log(callback);
                    User.getUserByUsername(userInfo.username, (err, user) => {
                        if (err) throw err;
                        if (user) {
                            return res.json({
                                success: false,
                                msg: 'There was an error changing the username. Email has been changed successfully'
                            });
                        }
                        else {
                            User.changeUsername(userInfo, (err, callback) => {
                                if (callback) {
                                    console.log(callback);
                                    return res.json({
                                        success: true,
                                        msg: 'Username and Email have been changed successfully'
                                    });
                                }

                            });
                        }
                    });
                }
            });
        }
    });
});

router.get('/sign-s3', (req, res) => {
    const s3 = new aws.S3();
    console.log(req.query);
    const fileName = req.query['file-name'];
    const fileType = req.query['file-type'];
    const s3Params = {
        Bucket: S3_BUCKET,
        Key: fileName,
        Expires: 60,
        ContentType: fileType,
        ACL: 'public-read'
    };

    s3.getSignedUrl('putObject', s3Params, (err, data) => {
        if (err) {
            console.log(err);
            return res.end();
        }
        const returnData = {
            signedRequest: data,
            url: `https://${S3_BUCKET}.s3.amazonaws.com/${fileName}`
        };
        console.log(returnData);
        return res.json(returnData);
    });
});

//Change artist name
router.post('/changeartistname', passport.authenticate('jwt', {session: false}), (req, res, next) => {
    //This variable will not be used if user already exists
    const userInfo = {
        name: req.body.name,
        currentName: req.body.currentName
    };

    User.changeArtistName(userInfo, (err, callback) => {
        if (callback) {
            console.log(callback);
            return res.json({success: true, msg: 'Artist name has been changed successfully'});
        }
    });
});

//Change artist email
router.post('/changeartistemail', passport.authenticate('jwt', {session: false}), (req, res, next) => {
    //This variable will not be used if user already exists
    const userInfo = {
        email: req.body.email,
        currentEmail: req.body.currentEmail
    };

    User.changeArtistEmail(userInfo, (err, callback) => {
        if (callback) {
            console.log(callback);
            return res.json({success: true, msg: 'Artist name has been changed successfully'});
        }
    });
});

// Change venue name
router.post('/changevenuename', passport.authenticate('jwt', {session: false}), (req, res, next) => {
    //This variable will not be used if user already exists
    const userInfo = {
        name: req.body.name,
        currentName: req.body.currentName
    };

    User.changeVenueName(userInfo, (err, callback) => {
        if (callback) {
            console.log(callback);
            return res.json({success: true, msg: 'Venue name has been changed successfully'});
        }
    });
});

module.exports = router;
