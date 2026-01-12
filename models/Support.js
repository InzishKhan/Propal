const mongoose = require('mongoose');

const supportSchema = new mongoose.Schema({
    email: { type: String, required: true },
    description: String,
    created_at: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Support', supportSchema);
