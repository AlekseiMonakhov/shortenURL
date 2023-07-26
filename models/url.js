const mongoose = require('mongoose');

const urlSchema = new mongoose.Schema({
    url: String,
    shortenedUrl: String,
    sessionId: String,
    createdAt: { type: Date, default: Date.now },
    clicks: { type: Number, default: 0 }
});

const Url = mongoose.model('Url', urlSchema);

module.exports = Url;