const mongoose = require('mongoose');
const config = require('../config/database');

// Artist Schema
const VenueSchema = mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    userId: {
        type: mongoose.Schema.ObjectId,
        ref: 'User',
        required: true
    },
    type:
        {
            type:String,
            required: true
        }

});

const Venue = module.exports = mongoose.model('Venue', VenueSchema);

module.exports.getVenueByName = function(name, callback){
    const query = {name: name};
    Venue.findOne(query, callback);
};

module.exports.addVenue = function(newVenue, callback){

    newVenue.save(callback);

};



