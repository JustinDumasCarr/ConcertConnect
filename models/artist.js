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
    }
});

const Artist = module.exports = mongoose.model('Artist', ArtistSchema);



module.exports.addArtist = function(newArtist, callback){
            newArtist.save(callback);
}



