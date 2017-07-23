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
            newArtist.save(callback);
};

module.exports.changeName = function(userInfo, callback){

    Artist.update({name: userInfo.currentName}, {
        name: userInfo.name
    }, callback);

};

module.exports.changeEmail = function (userInfo,callback) {
    Artist.update({email: userInfo.currentEmail},
        {
            email: userInfo.email
        }, callback)
};





