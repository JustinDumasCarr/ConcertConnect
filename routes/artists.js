const express = require('express');
const router = express.Router();
const passport = require('passport');
const jwt = require('jsonwebtoken');
const config = require('../config/database');
const User = require('../models/user');
const Artist = require('../models/artist');
const users = require('./users');
const aws = require('aws-sdk');


const S3_BUCKET =   process.env.S3_BUCKET;


//Gets latest id for an artist

router.post('/register', (req, res, next) => {
    let newArtist = new Artist({
        name: req.body.name,
        email: req.body.email,
        userId: req.body.userId,
        type: 'artist',
        profileImageURL: req.body.imageURL
    });

    Artist.addArtist(newArtist, (err, artist) => {
        if (err) {
            res.json({success: false, msg: 'Failed to register Artist'});
        } else {

            User.findByIdAndUpdate(
                newArtist.userId,
                {$push: {"artists": {artistId: artist._id, name: artist.name, type:'artist'}}},
                {safe: true, upsert: true, new: true},
                function (err, model) {
                    if (err) {
                        res.json({success: false, msg: 'Failed to update User'});
                    } else {
                        res.json({success: true, artists: model.artists});

                    }
                }
            );

        }
    });

});
router.post('/search', (req, res, next) => {
    Artist.find({ 'name': new RegExp(req.body.name,'i')}, 'name email profileImageURL', function (err, artists) {
        if (err) return (err);
        console.log(artists);
        return res.json(artists);
    })
});


//Returns venue information based on details
router.post('/getProfile', (req, res, next) => {

    Artist.getArtistByName(req.body.name, (err, artistexists) => {
        //Not sure if this actually throws an error
        if (err) throw err;
        if (artistexists) {
            return res.json(artistexists);
        }
        else {
            return res.json("");
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
        if(err){
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


//Change username
router.post('/changename', (req, res, next) =>
{

    //This variable will not be used if user already exists
    const userInfo =
        {
            name: req.body.name,
            currentName: req.body.currentName
        };


    //Checks if username exists
    Artist.getArtistByName(userInfo.name, (err, user) =>
    {
        if (err) throw err;
        if (user) {
            return res.json({success: false, msg: 'Name already exists'});
        }
        else
        {
            Artist.changeName(userInfo, (err, callback) => {
                if(callback)
                {
                    console.log(callback);
                    return res.json({success: true, msg: 'Name has been changed successfully'});
                }
            });
        }
    });
});

//Change email
router.post('/changeemail', (req, res, next) =>
{

    //This variable will not be used if user already exists
    const userInfo =
        {
            email: req.body.email,
            currentEmail: req.body.currentEmail
        };


    //Checks if username exists
    Artist.getArtistByEmail(userInfo.email, (err, user) =>
    {
        if (err) throw err;
        if (user) {
            return res.json({success: false, msg: 'Email already exists'});
        }
        else
        {
            Artist.changeEmail(userInfo, (err, callback) => {
                if(callback)
                {
                    console.log(callback);
                    return res.json({success: true, msg: 'Email has been changed successfully'});
                }
            });
        }
    });
});

module.exports = router;