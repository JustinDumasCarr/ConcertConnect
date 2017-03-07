const express = require('express');
const router = express.Router();
const passport = require('passport');
const jwt = require('jsonwebtoken');
const config = require('../config/database');
const User = require('../models/user');
const Artist = require('.../models/artist');
const artists = require('./artists');


router.post('/register', (req, res, next) => {
    let newArtist = new Artist({
        name: req.body.name,
        email: req.body.email,

    });

    Artist.addUser(newArtist, (err, user) => {
        if(err){
            res.json({success: false, msg:'Failed to register Artist'});
        } else {
            res.json({success: true, msg:'Artist registered'});
        }
    });
});

module.exports = router;