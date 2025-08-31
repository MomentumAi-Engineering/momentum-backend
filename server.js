<<<<<<< HEAD
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();
=======
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();
const contactRoutes = require('./routes/Contact');
>>>>>>> 708ae4719bbc388679cef281134a7823d65cedc3

const authRoutes = require("./routes/auth");
const chatbotRoutes = require("./routes/chatbot");

const app = express();

// Middlewares
app.use(cors());
app.use(express.json());

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/chatbot", chatbotRoutes);

<<<<<<< HEAD
app.get("/", (req, res) => {
  res.send("Welcome to the MomntumAI Backend API 🚀");
=======
app.use('/api/auth', authRoutes);
app.use('/api/contact' , contactRoutes);


app.get('/', (req, res) => {
  res.send('Welcome to the Momentum Backend API');
>>>>>>> 708ae4719bbc388679cef281134a7823d65cedc3
});

// MongoDB Connection (clean – no deprecated options)
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("✅ Connected to MongoDB"))
  .catch((err) => console.error("❌ MongoDB connection error:", err));

// Server Listener
const PORT = process.env.PORT || 5000;
app.listen(PORT, () =>
  console.log(`🚀 Server running on http://localhost:${PORT}`)
);

// Debugging: Show Redirect URI for OAuth
console.log("👉 Expected Redirect URI:", "http://localhost:5000/api/auth/google/callback");
