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
        },
    profileImageURL: {
        type: String,
        required: false
    },
    genres: [String],
    description: String,
    location: String,
    capacity: Number,
    hours: String,
    contracts: [{
        contractId:{type: mongoose.Schema.ObjectId, ref: 'Contract' }, date:{type:Date}, artistId:{type:String}
    }]
});

const Venue = module.exports = mongoose.model('Venue', VenueSchema);

module.exports.getVenueByID = function(objectID, callback){
    Venue.findById(objectID, callback);
};

module.exports.getVenueByEmail = function(name, callback){
    const query = {email: name};
    Venue.findOne(query, callback);
};

module.exports.addVenue = function(newVenue, callback){
    newVenue.save(callback);
};

module.exports.changeName = function(userInfo, callback) {
    Venue.update({name: userInfo.currentName}, {
        name: userInfo.name
    }, callback);
};

module.exports.changeEmail = function(userInfo, callback) {
    Venue.update({email: userInfo.currentEmail}, {
        email: userInfo.email
    }, callback);
};

module.exports.changeAllInfo = function(userInfo, callback) {
    Venue.update({_id: userInfo._id}, {
        name: userInfo.name,
        email: userInfo.email,
        genres: userInfo.genres,
        description: userInfo.description,
        location: userInfo.location,
        capacity: userInfo.capacity,
        hours: userInfo.hours
    }, callback)
};



