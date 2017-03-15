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
    }
});

const Venue = module.exports = mongoose.model('Venue', VenueSchema);

module.exports.getVenueByName = function(username, callback){
    const query = {username: username}
    Venue.findOne(query, callback);
}

module.exports.addVenue = function(newVenue, callback){

    newVenue.save(callback);

}



