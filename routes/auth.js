const express = require('express');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const axios = require('axios');
const User = require('../models/User');  
const router = express.Router();
const { sendSignupEmail } = require('../utils/emailService'); // 👈 import this


const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID;
const GOOGLE_CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET;
const GOOGLE_REDIRECT_URI = process.env.GOOGLE_REDIRECT_URI;

// ✅ Google OAuth route
router.post('/google', async (req, res) => {
  const { code } = req.body;

  try {
    // Step 1: Exchange code for access token
    const tokenRes = await axios.post("https://oauth2.googleapis.com/token", {
      code,
      client_id: GOOGLE_CLIENT_ID,
      client_secret: GOOGLE_CLIENT_SECRET,
      redirect_uri: GOOGLE_REDIRECT_URI,
      grant_type: 'myverysecurekey123!@',
    });

    const { access_token } = tokenRes.data;

    // Step 2: Fetch user info from Google
    const userRes = await axios.get("https://www.googleapis.com/oauth2/v2/userinfo", {
      headers: { Authorization: `Bearer ${access_token}` },
    });

    const { name, email } = userRes.data;

    // Step 3: Find or create user in MongoDB
    let user = await User.findOne({ email });

    if (!user) {
      user = new User({ name, email, password: "google_oauth_placeholder" });
      await user.save();
    }

    // Step 4: Generate JWT
    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET || 'myverysecurekey123!@',
      { expiresIn: '1h' }
    );

    res.json({
      token,
      redirectTo: '/snapfix',
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role
      }
    });
  } catch (error) {
    console.error("OAuth error:", error.response?.data || error.message);
    res.status(500).json({ error: "Google login failed" });
  }
});

// ✅ Signup route
// ✅ Signup route
router.post('/signup', async (req, res) => {
  const { name, email, password } = req.body;

  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({ name, email, password: hashedPassword });
    await newUser.save();

    // ✅ Send welcome email
    await sendSignupEmail(email, name); // 👈 Added this line

    const token = jwt.sign(
      { id: newUser._id, role: newUser.role },
      process.env.JWT_SECRET || 'myverysecurekey123!@',
      { expiresIn: '1h' }
    );

    res.status(201).json({
      message: 'User created successfully',
      token,
      redirectTo: '/snapfix',
      user: {
        id: newUser._id,
        name: newUser.name,
        email: newUser.email,
        role: newUser.role
      }
    });

  } catch (error) {
    console.error('Error during signup:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});


// ✅ Login route
router.post('/login', async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ message: 'User not found' });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(401).json({ message: 'Invalid credentials' });

    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET || 'myverysecurekey123!@',
      { expiresIn: '1h' }
    );

    res.json({
      token,
      redirectTo: '/snapfix',
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role
      }
    });
  } catch (err) {
    console.error('Login error:', err);
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
