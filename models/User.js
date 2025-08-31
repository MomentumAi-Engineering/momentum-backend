const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
    name: String,
    email: { type: String, unique: true, required: true },
    password: String,
    googleId: { type: String, unique: true, sparse: true }, // for Google OAuth
    role: { type: String, default: 'user' }
}, { timestamps: true });

module.exports = mongoose.model('User', UserSchema);
