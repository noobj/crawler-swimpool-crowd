const mongoose = require('mongoose');

const entrySchema = new mongoose.Schema({
    id: String,
    amount: Number,
    time: { type: [String], index: true }
});

module.exports = mongoose.model('Entry', entrySchema);
