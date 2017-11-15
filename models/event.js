const mongoose = require('mongoose');
const config = require('../config/database');

// Event Schema
const EventSchema = mongoose.Schema({
    name: {
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
        type: String,
        required: true
    },
    profileImageURL: {
        type: String,
        required: false
    },
    imageArray: [String],
    genres: [String],
    description: String,
    location : String,
    contracts: [{
        contractId:{type: mongoose.Schema.ObjectId, ref: 'Contract' }, date:{type:Date}, venueId:{type:String}
    }]


});

const Event = module.exports = mongoose.model('Event', EventSchema);

module.exports.getEventByID = function(objectID, callback){
    Event.findById(objectID, callback);

};

module.exports.getEventByVenueId = function(venueId, callback){
    const query = {venueId: venueId};
    Event.findOne(query, callback);
};

module.exports.addEvent = function(newArtist, callback){
    newEvent.save(callback);
};

