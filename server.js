const express = require('express');
const mongoose = require('mongoose');

require('dotenv').config();  //imported the env file

const app = express();
app.use(express.json());

mongoose.connect(process.env.MONGO_URI)
.then(() => {
    console.log('Connected to MongoDB');

    // const userSchema = new mongoose.Schema({
    //     name: String,
    //     email: String,
    //     password: String,
    // });
    // const User = mongoose.model('User', userSchema);

    // const sample = new User({
    //     name: 'Raj Baidyanath',
    //     email: 'raj76@gmail.com',
    //     password: 'raj12#'
    // });
    // sample.save()
    // .then(() => {
    //     console.log('Sample user saved successfully');
    // })
    // .catch(err => {
    //     console.error('Error saving sample user:', err);
    // })
})
.catch(err => {
        console.error('Error connecting to MongoDB:', err);
    
});

app.listen(5000, () => {
    console.log('Server is running on port 5000');
});