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
        userId: req.body.userId,
        type: 'venue'
    });


            Venue.addVenue(newVenue, (err, Venue) => {
                if (err) {
                    res.json({success: false, msg: 'Failed to register Venue'});
                } else {

                    User.findByIdAndUpdate(
                        newVenue.userId,
                        {$push: {"venues": {venueId:Venue._id, name:Venue.name, type: 'venue'}}},
                        {safe: true, upsert: true, new : true},
                        function(err, model) { //unecessary
                            if (err) {
                                res.json({success: false, msg: 'Failed to update User'});
                            } else {
                                res.json({success: true, venues: model.venues});

                            }
                        }
                    );



                }
            });




});

//Returns venue information based on details
router.post('/getProfile', (req, res, next) =>
{

    Venue.getVenueByName(req.body.name, (err,Venueexists) =>
    {
        //Not sure if this actually throws an error
        if(err) throw err;
        if(Venueexists)
        {
            res.json(Venueexists);
        }
        else
        {
            res.json("");
        }
    });

});


module.exports = router;