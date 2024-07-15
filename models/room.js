const mongoose = require('mongoose');

const roomSchema = mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    host: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    topic: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Topic'
    },
    participants: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }],
    chats: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Chat'
    }],
    description: {
        type: String,
    },
    
}, { timestamps: true });

module.exports = mongoose.model('Room', roomSchema);