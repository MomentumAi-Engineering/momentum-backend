const express = require('express');
const mongoose = require('mongoose');

require('dotenv').config();  //imported the env file

const app = express();
app.use(express.json());

mongoose.connect(process.env.MONGO_URI)
.then(() => {
    console.log('Connected to MongoDB');
})
.catch(err => {
        console.error('Error connecting to MongoDB:', err);
    
});

app.listen(5000, () => {
    console.log('Server is running on port 5000');
});