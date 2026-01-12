const mongoose = require('mongoose');

const reviewSchema = new mongoose.Schema({
    consumer: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    manufacturer: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    rating: { type: Number, required: true },
    comment: String,
    created_at: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Review', reviewSchema);
