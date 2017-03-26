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
    /*
    artistId:
        {
            type: Number,
            required: true
        }
        */

});

const Artist = module.exports = mongoose.model('Artist', ArtistSchema);

module.exports.getArtistByName = function(username, callback){
    const query = {username: username};
    Artist.findOne(query, callback);
};

module.exports.addArtist = function(newArtist, callback){
            newArtist.save(callback);
};





