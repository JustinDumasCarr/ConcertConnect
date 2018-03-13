const express = require('express');
const router = express.Router();
const passport = require('passport');
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const config = require('../config/database');
const User = require('../models/user');
const Artist = require('../models/artist');
const Request = require('../models/request');
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
        profileImageURL: null,
        soundcloudURL: req.body.soundcloudURL,
        facebookURL: req.body.facebookURL
    });
    let artistId = null;
    newArtist.save()
        .then((artist) => {
        console.log("userid: "+ req.body.userId);
        artistId = artist.id;
            return Artist.find({'userId': req.body.userId})
        })
        .then((artists) => {
        console.log('artists: ' + artists)
            return res.json({success: true, artists: artists, artistId:artistId});
        }).catch(err =>{
            console.log('err: ' + err)
    })


});

router.post('/saveProfileImageURL', passport.authenticate('jwt', {session: false}), (req, res, next) => {
    console.log(req.body);
    Artist.findOneAndUpdate({_id: req.body.artistId}, {profileImageURL: req.body.profileImageURL}, function (err, model)
    {
        console.log(model);
        if (err)
        {
            console.log(err);
            res.json('err' + err);
        }
        else
        {
            res.json('Artist profileImageURL Updated');
        }
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
            soundcloudURL: req.body.soundcloudURL,
            facebookURL: req.body.facebookURL,
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

router.post('/getrequests',  passport.authenticate('jwt', {session: false}),(req, res, next) => {

    let artistInfo = {
        artistId: req.body.artistId
      //  artistName: req.body.artistName
    };


    // Do the same with venues

    Request.getRequestByArtistId(artistInfo, (err, request) => {
        if(err) {
            res.json({success: false, msg: 'Failed to retrieve request'});
        } else {
            console.log("Request Data Testing");
            console.log(request);

            let i = request.length;
            while (i--) {
                // Removes requests where the artist is the initiator
                if(request[i]['initiator'] === req.body.artistName) {
                    request.splice(i, 1);
                }
            }
            res.json({success: true, requestData: request});
        }
    });



    // res.json({success: true});

});


module.exports = router;