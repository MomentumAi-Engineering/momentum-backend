const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const authRoutes = require('./routes/auth'); // ✅ Import your auth router

const app = express(); // ✅ Initialize the Express app

app.use(cors());             // ✅ Enable CORS
app.use(express.json());     // ✅ Parse JSON bodies

// ✅ Mount the auth routes under /api/auth
app.use('/api/auth', authRoutes);

// ✅ A simple root endpoint
app.get('/', (req, res) => {
  res.send('Welcome to the Momentum Backend API');
});

// ✅ Connect to MongoDB
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => console.error('Error connecting to MongoDB:', err));

// ✅ Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
