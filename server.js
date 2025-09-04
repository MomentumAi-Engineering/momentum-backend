const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();

// Routes
const authRoutes = require("./routes/auth");
const chatbotRoutes = require("./routes/chatbot");
const contactRoutes = require("./routes/Contact");

const app = express();

// Middlewares
app.use(cors());
app.use(express.json());

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/chatbot", chatbotRoutes);
app.use("/api/contact", contactRoutes);

// Root Route
app.get("/", (req, res) => {
  res.send("Welcome to the MomentumAI Backend API 🚀");
});

// MongoDB Connection
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
console.log(
  "👉 Expected Redirect URI:",
  process.env.GOOGLE_REDIRECT_URI
);
