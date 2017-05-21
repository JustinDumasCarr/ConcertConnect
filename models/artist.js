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





