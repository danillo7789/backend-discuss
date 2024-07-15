const mongoose = require('mongoose');

const chatSchema = mongoose.Schema({
    sender: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    text: {
        type: String,
        required: true
    },
    room: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Room'
    },
}, { timestamps: true });

module.exports = mongoose.model('Chat', chatSchema);