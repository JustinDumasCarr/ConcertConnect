const mongoose = require('mongoose');
const config = require('../config/database');
const ObjectId = require('mongoose').Types.ObjectId;

// Request Schema
const RequestSchema = mongoose.Schema({
    artistId: {
        type: mongoose.Schema.ObjectId,
        ref: 'Artist',
        required: true
    },
    venueId: {
        type: mongoose.Schema.ObjectId,
        ref: 'Venue',
        required: true
    },
    date: {
        type: Date,
        required: true
    },
    initiator: {
        type: String, // Not sure if this should be ObjectId
        required: true
    },
    initiatorType: {
        type: String,
        required: true
    }
});

const Request = module.exports = mongoose.model('Request', RequestSchema);

module.exports.addRequest = function(newRequest, callback){
    newRequest.save(callback);
};

module.exports.getRequestByArtistId = function (artist, callback) {
    const query = {artistId: ObjectId(artist.artistId)};
    Request.find(query, callback);
};

module.exports.getRequestByVenueId = function (venue, callback) {
    const query = {venueId: ObjectId(venue.venueId)};
    Request.find(query, callback);
};

// Get request by initiator id
module.exports.getRequestByInitiator = function (initatorId, callback) {
    const query = {initiator: initiator};
    Request.findOne(query, callback);
};

module.exports.deleteRequest = function (requestInfo, callback) {
    const query = {artistId: ObjectId(requestInfo['artistId']), venueId: ObjectId(requestInfo['venueId']), date: requestInfo['date'],
    initiator: requestInfo['initiator'], initiatorType: requestInfo['initiatorType']};
    console.log("Query Testing");
    console.log(query);
    Request.find(query).remove(callback);
};




