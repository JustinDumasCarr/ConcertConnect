const User = require('../models/user');
const Artist = require('../models/artist');
const Venue = require('../models/venue');
const Contract = require('../models/contract');
const mongoose = require('mongoose');


module.exports = {

    getUserArtists: async (user) => {

        try {
            const artists = await Artist.find({'userId' : user._id});
            const venues = await Venue.find({'userId' : user._id});
             return ({'artists': artists,'venues':venues});
        }
        catch (err) {

            next(err)
        }
    },

    getUserVenues: async (req, res, next) => {

        const venues = await Venue.find({});
    }

};