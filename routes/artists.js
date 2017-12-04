const express = require('express');
const router = express.Router();
const passport = require('passport');
const jwt = require('jsonwebtoken');
const config = require('../config/database');
const User = require('../models/user');
const Artist = require('../models/artist');
const Request = require('../models/request');
const users = require('./users');

//Gets latest id for an artist
router.post('/register',  passport.authenticate('jwt', {session: false}), (req, res, next) => {
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
router.post('/search',  (req, res, next) => {
    Artist.find({ 'genres': new RegExp(req.body.genre,'i')}, 'name email description genres profileImageURL', function (err, artists) {
        if (err) return (err);
        console.log(artists);
        return res.json(artists);
    })
});


//Returns artist information based on details
router.post('/getProfile', passport.authenticate('jwt', {session: false}), (req, res, next) => {

console.log(req.body);

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

router.post('/changeartistinformation', passport.authenticate('jwt', {session: false}), (req, res, next) =>
{
    const userInfo =
        {
            _id: req.body._id,
            name: req.body.name,
            email: req.body.email,
            genres: req.body.genres,
            description: req.body.description,
            soundcloudURL: req.body.soundcloudURL
        };

    Artist.getArtistByID(userInfo._id, (err,user) => {
       if (err) throw err;
       if (user) {
           Artist.changeAllInfo(userInfo, (err, callback) => {
               User.changeArtistNameByID(userInfo, (err, callback) => {
                   if(callback)
                   {
                       return res.json({success: true, msg: 'Information has been changed successfully'});
                   } else {
                       return res.json({success: false, msg: 'An error occured. Please try again'});
                   }
               });
           });
       }
    });
});

router.post('/createRequest',  passport.authenticate('jwt', {session: false}),(req, res, next) => {

    let newRequest = new Request({
        artistId: req.body.artistId,
        venueId: req.body.venueId,
        date: req.body.date,
        initiator: req.body.initiator,
        initiatorType: req.body.initiatorType // Not sure if this is needed
    });

    Request.addRequest(newRequest, (err, contract) => {
        if (err) {
            res.json({success: false, msg: 'Failed to submit request'});
        } else {
            res.json({success: true, msg: 'Request successfully submitted'});
        }
    });
});


module.exports = router;