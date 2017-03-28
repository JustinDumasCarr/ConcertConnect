const express = require('express');
const router = express.Router();
const passport = require('passport');
const jwt = require('jsonwebtoken');
const config = require('../config/database');
const User = require('../models/user');
const Artist = require('../models/artist');
const users = require('./users');


//Gets latest id for an artist

router.post('/register', (req, res, next) => {
    let newArtist = new Artist({
        name: req.body.name,
        email: req.body.email,
        userId: req.body.userId
    });

    Artist.getArtistByName(req.body.name, (err, artistexists) => {


        if (err) throw err;
        if (artistexists) {
            return res.json({success: false, msg: 'Artist Exists'});

        } else {
            Artist.addArtist(newArtist, (err, artist) => {
                if (err) {
                    res.json({success: false, msg: 'Failed to register Artist'});
                } else {

                    User.findByIdAndUpdate(
                        newArtist.userId,
                        {$push: {"artists": { artistId: artist._id, name: artist.name}}},
                        {safe: true, upsert: true, new : true},
                        function(err, model) { //unecessary
                        }
                    );


                    res.json({success: true, msg: 'Artist registered'});
                }
            });


        }
    });
});

//Returns venue information based on details
router.post('/getProfile', (req, res, next) =>
{

   Artist.getArtistByName(req.body.name, (err,artistexists) =>
    {
        //Not sure if this actually throws an error
        if(err) throw err;
        if(artistexists)
        {
            return res.json(artistexists);
        }
        else
        {
            return res.json("");
        }
    });

});

module.exports = router;