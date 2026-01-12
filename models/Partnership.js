const mongoose = require('mongoose');

const partnershipSchema = new mongoose.Schema({
    manufacturer: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    partner_company_name: String,
    partner_benefits: String,
    created_at: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Partnership', partnershipSchema);
