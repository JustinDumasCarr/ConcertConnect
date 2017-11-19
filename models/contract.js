const mongoose = require('mongoose');
const config = require('../config/database');

// Artist Schema
const ContractSchema = mongoose.Schema({
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
    }
});

const Contract = module.exports = mongoose.model('Contract', ContractSchema);

module.exports.addContract = function(newContract, callback){
    newContract.save(callback);
};
module.exports.getContractByID = function (objectID, callback) {
    Contract.findById(objectID, callback);
};

module.exports.getContractByArtistId = function (artistId, callback) {
    const query = {artistId: artistId};
    Contract.findOne(query, callback);
};






