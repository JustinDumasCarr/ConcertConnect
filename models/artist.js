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
    }


});

const Artist = module.exports = mongoose.model('Artist', ArtistSchema);

module.exports.getArtistByName = function(name, callback){
    const query = {name: name};
    Artist.findOne(query, callback);
};

module.exports.addArtist = function(newArtist, callback){
            newArtist.save(callback);
};





