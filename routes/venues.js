const express = require('express');
const router = express.Router();
const passport = require('passport');
const jwt = require('jsonwebtoken');
const config = require('../config/database');
const User = require('../models/user');
const Venue = new require('../models/venue');
const Contract = require('../models/contract');
const Request = require('../models/request');
const users = require('./users');
const Artist = new require('../models/artist');
router.post('/register',  passport.authenticate('jwt', {session: false}),(req, res, next) => {

    let newVenue = new Venue({
        name: req.body.name,
        email: req.body.email,
        userId: req.body.userId,
        type: 'venue',
        profileImageURL: req.body.profileImageURL,
        description: req.body.description,
        genres: req.body.genres,
        capacity: req.body.capacity,
        facebookURL: req.body.facebookURL,
        location: req.body.location,
        hours: req.body.hours
    });
    let venueId = null;
    newVenue.save()
        .then((venue) => {
            console.log("userid: "+ req.body.userId);
            venueId = venue.id;
            return Artist.find({'userId': req.body.userId})
        })
        .then((venues) => {
            console.log('artists: ' + venues)
            return res.json({success: true, artists: venues, venueId:venueId});
        }).catch(err =>{
        console.log('err: ' + err)
    })


});

router.post('/saveProfileImageURL', passport.authenticate('jwt', {session: false}), (req, res, next) => {
    console.log(req.body);
    Venue.findOneAndUpdate({_id: req.body.venueId}, {profileImageURL: req.body.profileImageURL}, function (err, model)
    {
        console.log(model);
        if (err)
        {
            console.log(err);
            res.json('err' + err);
        }
        else
        {
            res.json('Venue profileImageURL Updated');
        }
    })

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

});

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


router.post('/changevenueinformation', passport.authenticate('jwt', {session: false}), (req, res, next) =>
{
    const userInfo =
        {
            _id: req.body._id,
            name: req.body.name,
            email: req.body.email,
            genres: req.body.genres,
            description: req.body.description,
            hours: req.body.hours,
            location: req.body.location,
            capacity: req.body.capacity
        };

    Venue.getVenueByID(userInfo._id, (err,user) => {
        if (err) throw err;
        if (user) {
            Venue.changeAllInfo(userInfo, (err, callback) => {
                User.changeVenueNameByID(userInfo, (err, callback) => {
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

router.post('/getContracts', passport.authenticate('jwt',{session: false}), (req,res)=> {

    Contract.find({venueId: req.body.venueId}, function (err, contracts) {
        if (err) {
            res.json({success: false, msg: 'Failed to retrieve request'});
        } else {
            res.json({success: true, contracts: contracts});
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

router.post('/deleteRequest',  passport.authenticate('jwt', {session: false}),(req, res, next) => {
    let requestInfo = new Request({
        artistId: req.body.artistId,
        venueId: req.body.venueId,
        date: req.body.date,
        initiator: req.body.initiator,
        initiatorType: req.body.initiatorType // Not sure if this is needed
    });

    Request.deleteRequest(requestInfo, (err, request) => {
        if (err) {
            res.json({success: false, msg: 'Failed to submit request'});
        } else {
            res.json({success: true, msg: 'Request successfully submitted'});
        }
    });
});

router.post('/getrequests',  passport.authenticate('jwt', {session: false}),(req, res, next) => {

    let venueInfo = {
        venueId: req.body.venueId
    };


    Request.getRequestByVenueId(venueInfo, (err, request) => {
        if(err) {
            res.json({success: false, msg: 'Failed to retrieve request'});
        } else {

            let i = request.length;
            while (i--) {
                // Removes requests where the artist is the initiator
                if(request[i]['initiator'] === req.body.venueName) {
                    request.splice(i, 1);
                }
            }
            res.json({success: true, requestData: request});
        }
    });
});

router.post('/createContract',  passport.authenticate('jwt', {session: false}),(req, res, next) => {
    let newContract = new Contract({
        artistId: req.body.artistId,
        venueId: req.body.venueId,
        date: req.body.date,
    });

    Contract.addContract(newContract, (err, contract) => {
        if (err) {
            res.json({success: false, msg: 'Failed to submit contract'});
        } else {
            res.json({success: true, msg: 'Contract successfully submitted'});
        }
    });
});

module.exports = router;