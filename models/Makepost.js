const mongoose = require('mongoose');

const PostSchema = new mongoose.Schema({
    Title: {
        type: String,
        required: true
    },
    Text: {
        type: String,
        required: true
    },
    date: {
        type: Date,
        default: Date.now
    }
});

const Makepost = mongoose.model('Makepost', PostSchema);

module.exports = Makepost;