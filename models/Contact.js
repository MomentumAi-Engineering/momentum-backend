const mongoose = require('mongoose');

const contactSchema  = new mongoose.Schema({
    name: {type: String, required:true},
    email: {type: String, required:true},
    phoneNumber: {type: String, required:true},
    reason: { type: String, enum: ["General Inquiry", "Technical Support", "Sales", "Other"], required: true },
    subject: {type: String, required:true},
    message: {type: String, required:true},
    privacyAccepted: { type: Boolean, default: false },
    createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model("Contact", contactSchema);