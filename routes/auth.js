const express = require('express');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const axios = require('axios');
const User = require('../models/User');  
const router = express.Router();
const { sendSignupEmail } = require('../utils/emailService');

const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID;
const GOOGLE_CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET;
const GOOGLE_REDIRECT_URI = process.env.GOOGLE_REDIRECT_URI;

// ✅ Forgot password
router.post('/forgot-password', async (req, res) => {
  const { email } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Generate reset token
    const resetToken = jwt.sign(
      { id: user._id },
      process.env.JWT_SECRET || 'myverysecurekey123!@',
      { expiresIn: '15m' }
    );

    const resetLink = `http://localhost:5173/reset-password/${resetToken}`; 
    // 👆 replace localhost with your frontend domain when deployed

    // TODO: Send email here with resetLink
    console.log("Reset Link:", resetLink);

    res.json({ message: `Password reset link sent to ${email}` });
  } catch (err) {
    console.error("Forgot password error:", err);
    res.status(500).json({ message: "Server error" });
  }
});

// ✅ Reset password
router.post('/reset-password/:token', async (req, res) => {
  const { token } = req.params;
  const { password } = req.body;

  try {
    // Verify token
    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET || 'myverysecurekey123!@'
    );

    // Hash new password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Update user’s password
    await User.findByIdAndUpdate(decoded.id, { password: hashedPassword });

    res.json({ message: "Password has been reset successfully!" });
  } catch (err) {
    console.error("Reset password error:", err);
    res.status(400).json({ message: "Invalid or expired token" });
  }
});
