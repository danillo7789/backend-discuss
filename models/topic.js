const mongoose = require('mongoose');

const topicSchema = mongoose.Schema({
    name: {
        type: String,
        required: true,
    },  
}, { timestamps: true });

module.exports = mongoose.model('Topic', topicSchema);