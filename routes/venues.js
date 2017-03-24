const express = require('express');
const router = express.Router();
const passport = require('passport');
const jwt = require('jsonwebtoken');
const config = require('../config/database');
const User = require('../models/user');
const Venue = require('../models/venue');
const users = require('./users');

router.post('/register', (req, res, next) => {
    let newVenue = new Venue({
        name: req.body.name,
        email: req.body.email,
        userId: req.body.userId
    });

    Venue.getVenueByName(req.body.name, (err, Venueexists) => {


        if (err) throw err;
        if (Venueexists) {
            return res.json({success: false, msg: 'Venue Exists'});

        } else {
            Venue.addVenue(newVenue, (err, Venue) => {
                if (err) {
                    res.json({success: false, msg: 'Failed to register Venue'});
                } else {

                    User.findByIdAndUpdate(
                        newVenue.userId,
                        {$push: {"venues": {venueId:Venue._id, name:Venue.name}}},
                        {safe: true, upsert: true, new : true},
                        function(err, model) { //unecessary

                        }
                    );


                    res.json({success: true, msg: 'Venue registered'});
                }
            });


        }
    });
});

module.exports = router;