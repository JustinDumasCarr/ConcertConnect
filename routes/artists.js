const express = require('express');
const router = express.Router();
const passport = require('passport');
const jwt = require('jsonwebtoken');
const config = require('../config/database');
const User = require('../models/user');
const Artist = require('../models/artist');
const users = require('./users');


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
                        {$push: {"artists": artist._id}},
                        {safe: true, upsert: true, new : true},
                        function(err, model) {
                            console.log(err);
                        }
                    );


                    res.json({success: true, msg: 'Artist registered'});
                }
            });


        }
    });
});

module.exports = router;