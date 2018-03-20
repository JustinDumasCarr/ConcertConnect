const mongoose = require('mongoose');
const config = require('../config/database');
const ObjectId = require('mongoose').Types.ObjectId;

// Message Schema
const MessageSchema = mongoose.Schema({
    fromId: {
        type: String,
        required: true
    },
    toId: {
        type: String,
        required: true
    },
    message: {
        type: String,
        required: true
    },
    seenOn: {
        type: Date,
        required: true
    },
});

const Message = module.exports = mongoose.model('Message', MessageSchema);






