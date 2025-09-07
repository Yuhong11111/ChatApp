const express = require('express');
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
require('dotenv').config();
const User = require('./models/User.js');

// console.log(process.env.MONGO_URL);

mongoose.connect(process.env.MONGO_URL, {
}).then(() => {
  console.log('Connected to MongoDB');
}).catch((err) => {
  console.error('Error connecting to MongoDB:', err);
});

const jwt_screte = process.env.JWT_SECRET;

const app = express();

app.get('/test', (req, res) => {
  res.json('Hello from the backend!' );
});

app.post('/register', async (req, res) => {
    const { username, password } = req.body;
    const createdUser = await User.create({ username, password });
    // Create a JWT token with the user’s ID inside
    jwt.sign({userId:createdUser._id},// payload (what’s inside the token)
        jwt_screte,// secret key (used to sign)
        (err, token) => {
        if(err) throw err;
        res.cookie('token', token).status(201).json('ok');
    })
});

app.listen(3000, () => {
  console.log('Server is running on port 3000');
});

//3bA2mzebz7prQoFs