const mongoose = require('mongoose');

const TextSchema = new mongoose.Schema({
    postTitle: {
        type: String,
        required: true
    },
    postText: {
        type: String,
        required: true
    },
    date: {
        type: Date,
        default: Date.now
    },
    img: {
        type: String,
        required: false
    }
});

const Createpost = mongoose.model('Createpost', TextSchema);

module.exports = Createpost;