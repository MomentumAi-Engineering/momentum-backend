const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const axios = require("axios");
const User = require("../models/User");
const { sendSignupEmail } = require("../utils/emailService");

const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID;
const GOOGLE_CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET;
const GOOGLE_REDIRECT_URI = process.env.GOOGLE_REDIRECT_URI;

// ---------- Google OAuth: Redirect user to Google ----------
router.get("/google", (req, res) => {
  const rootUrl = "https://accounts.google.com/o/oauth2/v2/auth";
  const options = new URLSearchParams({
    redirect_uri: GOOGLE_REDIRECT_URI,
    client_id: GOOGLE_CLIENT_ID,
    access_type: "offline",
    response_type: "code",
    prompt: "consent",
    scope: "openid email profile",
  });

  console.log("👉 Redirecting to Google with URI:", GOOGLE_REDIRECT_URI);
  res.redirect(`${rootUrl}?${options.toString()}`);
});

// ---------- Google OAuth: Callback ----------
// 🔄 Ab yeh route seedha /callback hoga (Google Console ke liye match)
router.get("/google/callback", async (req, res) => {
  const code = req.query.code;
  if (!code) {
    console.error("❌ No authorization code received from Google");
    return res.status(400).send("No code received");
  }

  try {
    // Exchange code for tokens
    const params = new URLSearchParams();
    params.append("code", code);
    params.append("client_id", GOOGLE_CLIENT_ID);
    params.append("client_secret", GOOGLE_CLIENT_SECRET);
    params.append("redirect_uri", GOOGLE_REDIRECT_URI);
    params.append("grant_type", "authorization_code");

    console.log("👉 Exchanging code for tokens with redirect_uri:", GOOGLE_REDIRECT_URI);

    const tokenRes = await axios.post(
      "https://oauth2.googleapis.com/token",
      params.toString(),
      {
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
      }
    );

    const { access_token } = tokenRes.data;

    // Fetch user info
    const userRes = await axios.get("https://www.googleapis.com/oauth2/v2/userinfo", {
      headers: { Authorization: `Bearer ${access_token}` },
    });

    const { id: googleId, name, email } = userRes.data;

    // Find or create user
    let user = await User.findOne({ email });
    if (!user) {
      user = new User({
        name,
        email,
        googleId,
        password: "google_auth", // placeholder
      });
      await user.save();
      await sendSignupEmail(email, name);
    }

    // Generate JWT
    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    // 🔄 Redirect to frontend OR return JSON
    const frontendUrl = process.env.FRONTEND_URL || "http://localhost:3000";
    console.log("✅ Google login successful for:", email);
    res.redirect(`${frontendUrl}?token=${token}`);

    // Agar redirect nahi chahiye toh:
    // res.json({ token, user });
  } catch (error) {
    console.error("❌ Google OAuth error:", error.response?.data || error.message);
    res.status(500).send("Google login failed");
  }
});

// ---------- Signup ----------
router.post("/signup", async (req, res) => {
  const { name, email, password } = req.body;
  try {
    const existingUser = await User.findOne({ email });
    if (existingUser)
      return res.status(400).json({ message: "User already exists" });

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({ name, email, password: hashedPassword });
    await newUser.save();
    await sendSignupEmail(email, name);

    const token = jwt.sign(
      { id: newUser._id, role: newUser.role },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );
    res.status(201).json({
      token,
      user: {
        id: newUser._id,
        name: newUser.name,
        email: newUser.email,
        role: newUser.role,
      },
    });
  } catch (err) {
    console.error("Signup error:", err);
    res.status(500).json({ message: "Internal server error" });
  }
});

// ---------- Login ----------
router.post("/login", async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ message: "User not found" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch)
      return res.status(401).json({ message: "Invalid credentials" });

    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );
    res.json({
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (err) {
    console.error("Login error:", err);
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
