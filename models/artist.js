const mongoose = require('mongoose');
const config = require('../config/database');

// Artist Schema
const ArtistSchema = mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    contactEmail: String,
    phoneNumber: String,
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
    soundcloudURL: String,
    contracts: [{
        contractId:{type: mongoose.Schema.ObjectId, ref: 'Contract' }, date:{type:Date}, venueId:{type:String}
    }]


});

const Artist = module.exports = mongoose.model('Artist', ArtistSchema);

module.exports.getArtistByID = function(objectID, callback){
    Artist.findById(objectID, callback);

};

module.exports.getArtistByEmail = function(name, callback){
    const query = {email: name};
    Artist.findOne(query, callback);
};

module.exports.addArtist = function(newArtist, callback){
            newArtist.save().then;
};

module.exports.changeName = function(userInfo, callback){

    Artist.update({_id: userInfo._id}, {
        name: userInfo.name
    }, callback);

};

module.exports.changeEmail = function (userInfo,callback) {
    Artist.update({_id: userInfo._id},
        {
            email: userInfo.email
        }, callback)
};

module.exports.changeDescription = function (userInfo,callback) {
    Artist.update({_id: userInfo._id},
        {
            description: userInfo.description
        }, callback)
};

module.exports.changeGenres = function (userInfo,callback) {
    Artist.update({_id: userInfo._id},
        {
            genres: userInfo.genres
        }, callback)
};

module.exports.changesoundcloudURL = function (userInfo,callback) {
    Artist.update({_id: userInfo._id},
        {
            soundcloudURL: userInfo.soundcloudURL
        }, callback)
};

module.exports.changeAllInfo = function(userInfo, callback) {
    Artist.update({_id: userInfo._id},
        {
            name: userInfo.name,
            email: userInfo.email,
            description: userInfo.description,
            genres: userInfo.genres,
            soundcloudURL: userInfo.soundcloudURL
        }, callback)
};





