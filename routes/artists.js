const express = require('express');
const router = express.Router();
const passport = require('passport');
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const config = require('../config/database');
const User = require('../models/user');
const Artist = new require('../models/artist');
const users = require('./users');

//Gets latest id for an artist
router.post('/register', passport.authenticate('jwt', {session: false}), (req, res, next) => {
    let newArtist = new Artist({
        name: req.body.name,
        email: req.body.email,
        userId: req.body.userId,
        description: req.body.description,
        genres: req.body.genres,
        type: 'artist',
        profileImageURL: req.body.imageURL,
        soundcloudURL: req.body.soundcloudURL
    });

    newArtist.save()
        .then(() => {
        console.log("userid: "+ req.body.userId)
            return Artist.find({'userId': req.body.userId})
        })
        .then((artists) => {
        console.log('artists: ' + artists)
            return res.json({success: true, artists: artists});
        }).catch(err =>{
            console.log('err: ' + err)
    })


});
router.post('/search', (req, res, next) => {
    Artist.find({'genres': new RegExp(req.body.genre, 'i')}, 'name email description genres profileImageURL', function (err, artists) {
        if (err) return (err);
        console.log(artists);
        return res.json(artists);
    })
});

router.post('/getArtists', passport.authenticate('jwt', {session: false}), (req, res, next) => {


    Artist.find({'userId' : req.body.userId}, (err, artistexists) => {
        //Not sure if this actually throws an error
        if (err) throw err;
        console.log(artistexists);
        if (artistexists) {
            return res.json({artists : artistexists});
        }
        else {
            return res.json("");
        }
    });

});

//Returns artist information based on details
router.post('/getProfile', passport.authenticate('jwt', {session: false}), (req, res, next) => {


    Artist.getArtistByID(req.body._id, (err, artistexists) => {
        //Not sure if this actually throws an error
        if (err) throw err;
        console.log(artistexists);
        if (artistexists) {
            return res.json(artistexists);
        }
        else {
            return res.json("");
        }
    });

});

router.post('/changeartistinformation', passport.authenticate('jwt', {session: false}), (req, res, next) => {
    const userInfo =
        {
            _id: req.body._id,
            name: req.body.name,
            email: req.body.email,
            genres: req.body.genres,
            description: req.body.description,
            soundcloudURL: req.body.soundcloudURL
        };

    Artist.getArtistByID(userInfo._id, (err, user) => {
        if (err) throw err;
        if (user) {
            Artist.changeAllInfo(userInfo, (err, callback) => {
                User.changeArtistNameByID(userInfo, (err, callback) => {
                    if (callback) {
                        return res.json({success: true, msg: 'Information has been changed successfully'});
                    } else {
                        return res.json({success: false, msg: 'An error occured. Please try again'});
                    }
                });
            });
        }
    });
});

module.exports = router;