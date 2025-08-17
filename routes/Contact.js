const express = require("express");
const Contact = require("../models/Contact"); // your Mongoose model
const router = express.Router();

router.post("/", async (req, res) => {
  try {
    const { name, email, phoneNumber, subject, reason, message, privacyAccepted } = req.body;

    // Validate required fields
    if (!name || !email || !message || !privacyAccepted) {
      return res.status(400).json({ error: "Name, email, message and privacy consent are required" });
    }

    const newContact = new Contact({
      name,
      email,
      phoneNumber,
      subject,
      reason,
      message,
      privacyAccepted,
    });

    await newContact.save();
    res.status(201).json({ message: "Contact form submitted successfully" });
  } catch (err) {
    console.error("Error saving contact:", err.message);
    res.status(500).json({ error: "Server error" });
  }
});

module.exports = router;
