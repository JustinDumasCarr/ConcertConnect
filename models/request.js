const mongoose = require('mongoose');
const config = require('../config/database');

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
        type: ObjectId,
        required: true
    }
});

const Request = module.exports = mongoose.model('Request', RequestSchema);

module.exports.addRequest = function(newRequest, callback){
    newRequest.save(callback);
};

module.exports.getRequestByArtistId = function (artistId, callback) {
    const query = {artistId: artistId};
    Request.findOne(query, callback);
};

module.exports.getRequestByVenueId = function (venueId, callback) {
    const query = {venueId: venueId};
    Request.findOne(query, callback);
};

// Get request by initiator
// module.exports.getRequestByInitiator = function (initatorId, callback) {
//     const query = {};
// }
//





