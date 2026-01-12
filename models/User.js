const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    username: { type: String, required: true, unique: true },
    email: { type: String, required: true }, // Login email
    password: { type: String, required: true },
    role: { type: String, enum: ['M', 'C', 'A'], required: true },

    // Profile Fields (Common)
    company_name: String,
    contact_name: String,
    contact_email: String, // Display email
    contact_phone: String,
    website_url: String,
    address: String,
    image: String,
    rating: { type: Number, default: 0 },
    is_premium: { type: Boolean, default: false },

    // Manufacturer Specific
    raw_materials: String,
    meeting_locations: [{
        address: String,
        created_at: { type: Date, default: Date.now }
    }],

    // Subscription/Premium Data
    subscription: {
        type: String, // 'basic', 'standard', 'premium'
        start_date: Date,
        end_date: Date
    },

    created_at: { type: Date, default: Date.now }
});

module.exports = mongoose.model('User', userSchema);
