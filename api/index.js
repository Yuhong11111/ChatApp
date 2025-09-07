const express = require('express');
const mongoose = require('mongoose');
require('dotenv').config();
const User = require('./models/User.js');

// console.log(process.env.MONGO_URL);

mongoose.connect(process.env.MONGO_URL, {
}).then(() => {
  console.log('Connected to MongoDB');
}).catch((err) => {
  console.error('Error connecting to MongoDB:', err);
});

const app = express();

app.get('/test', (req, res) => {
  res.json('Hello from the backend!' );
});

app.post('/register', async (req, res) => {
    const { username, password } = req.body;
    await User.create({ username, password });
});

app.listen(3000, () => {
  console.log('Server is running on port 3000');
});

//3bA2mzebz7prQoFs