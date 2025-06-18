const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const authRoutes = require('./routes/auth'); 

const app = express();

app.use(cors());           
app.use(express.json());    


app.use('/api/auth', authRoutes);


app.get('/', (req, res) => {
  res.send('Welcome to the Momentum Backend API');
});


mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => console.error('Error connecting to MongoDB:', err));


const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
