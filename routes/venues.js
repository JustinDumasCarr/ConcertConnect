const express = require('express');
const router = express.Router();
const passport = require('passport');
const jwt = require('jsonwebtoken');
const config = require('../config/database');
const User = require('../models/user');
const Venue = require('../models/venue');
const Contract = require('../models/contract');
const users = require('./users');
const Artist = require('../models/artist');
router.post('/register',  passport.authenticate('jwt', {session: false}),(req, res, next) => {
    let newVenue = new Venue({
        name: req.body.name,
        email: req.body.email,
        userId: req.body.userId,
        type: 'venue',
        profileImageURL: req.body.imageURL,
        description: req.body.description,
        genres: req.body.genres,
        capacity: req.body.capacity,
        location: req.body.location,
    });


    Venue.addVenue(newVenue, (err, Venue) => {
        if (err) {
            res.json({success: false, msg: 'Failed to register Venue'});
        } else {

            User.findByIdAndUpdate(
                newVenue.userId,
                {$push: {"venues": {venueId: Venue._id, name: Venue.name, type: 'venue'}}},
                {safe: true, upsert: true, new: true},
                function (err, model) { //unecessary
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
router.post('/createContract',  passport.authenticate('jwt', {session: false}),(req, res, next) => {
    console.log(req.body.artistId);
    console.log('venueId:' + req.body.venueId);
    let newContract = new Contract({
        artistId: req.body.artistId,
        venueId: req.body.venueId,
        date: req.body.date
    });

    Contract.addContract(newContract, (err, contract) => {
        if (err) {
            res.json({success: false, msg: 'Failed to register Contract'});
        } else {

            Venue.findByIdAndUpdate(
                newContract.venueId,
                {$push: {"contracts": {contractId: contract._id, date: contract.date, artistId: contract.artistId}}},
                {safe: true, upsert: true, new: true},
                function (err, model) {
                    if (err) {
                        res.json({success: false, msg: 'Failed to update Venue'});
                    } else {
                        Artist.findByIdAndUpdate(newContract.artistId,
                            {
                                $push: {
                                    "contracts": {
                                        contractId: contract._id,
                                        date: contract.date,
                                        venueId: contract.venueId
                                    }
                                }
                            }
                            ,
                            {
                                safe: true, upsert: true, new: true
                            }
                            ,
                            function (err, model) {
                                if (err) {
                                    res.json({success: false, msg: 'Failed to update Venue'});
                                } else {
                                    res.json({success: true, contract: contract});
                                }
                            }
                        )

                    }
                }
            );
        }

    })
    ;

})
;

//Returns venue information based on details
router.post('/getProfile', passport.authenticate('jwt', {session: false}),(req, res, next) => {

    Venue.getVenueByID(req.body._id, (err, Venueexists) => {
        if (err) throw err;
        if (Venueexists) {
             res.json(Venueexists);
        }
        else {
            res.json("Venue does not exist");
        }
    });

});

router.post('/search', (req, res, next) => {
    if (req.body.capacity == 0) {
        Venue.find({
            'genres': new RegExp(req.body.genre, 'i'),
        }, 'name email description genres profileImageURL capacity location', function (err, venues) {
            if (err) return (err);
            console.log(venues);
            return res.json(venues);
        })
    }
    else {
        Venue.find({
            'genres': new RegExp(req.body.genre, 'i'),
            'capacity': {$lt: req.body.capacity + 1}
        }, 'name email description genres profileImageURL capacity location', function (err, venues) {
            if (err) return (err);
            console.log(venues);
            return res.json(venues);
        })

    }
});

//Change name and email
router.post('/changenameandemail', passport.authenticate('jwt', {session: false}), (req, res, next) => {
    const emailInfo = {
        email: req.body.email,
        currentEmail: req.body.currentEmail,
    };

    const nameInfo = {
        name: req.body.name,
        currentName: req.body.currentName
    };

    //Checks if artist exists
    Venue.getVenueByEmail(emailInfo.email, (err, user) => {
        if (err) throw err;
        if (user) {
            return res.json({success: false, msg: 'Email already exists'});
        }
        else {
            Venue.changeEmail(emailInfo, (err, callback) => {
                if (callback) {
                    Venue.changeName(nameInfo, (err, callback) => {
                        if (callback) {
                            return res.json({success: true, msg: 'Name and Email have been changed successfully'});
                        }
                    });
                }
            });
        }
    });

});


module.exports = router;