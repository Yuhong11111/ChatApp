const express = require('express');
const mongoose = require('mongoose');
const cookieParser = require('cookie-parser');
const jwt = require('jsonwebtoken');
require('dotenv').config();
const User = require('./models/User.js');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const ws = require('ws');

// console.log(process.env.MONGO_URL);

mongoose.connect(process.env.MONGO_URL, {
}).then(() => {
  console.log('Connected to MongoDB');
}).catch((err) => {
  console.error('Error connecting to MongoDB:', err);
});

const jwt_screte = process.env.JWT_SECRET;
const salt = bcrypt.genSaltSync(10);

const app = express();
app.use(express.json());
app.use(cookieParser());

app.use(cors({
  origin: process.env.CLIENT_URL,  // allow frontend
  credentials: true                 // allow cookies (if using JWT in cookies)
}));

app.get('/test', (req, res) => {
  res.json('Hello from the backend!' );
});

app.get('/profile', (req, res) => {
    const token  = req.cookies?.token;
    if(token){
        jwt.verify(token, jwt_screte, {}, (err, userData) => {
            if(err) throw err;
            res.json(userData);
        });
    } else {
        res.status(401).json('no token');
    }
});

app.post('/login', async (req, res) => {
  const { username, password } = req.body;
  const foundUser = await User.findOne({ username });
  if(foundUser) {
    const passOk = bcrypt.compareSync(password, foundUser.password); 
    if(passOk) {
      // Create a JWT token with the user’s ID inside
      jwt.sign({userId:foundUser._id, username},// payload (what’s inside the token)
        jwt_screte,// secret key (used to sign)
        (err, token) => {
        if(err) throw err;
        res.cookie('token', token, {sameSite:'none', secure:true}).json({
            id: foundUser._id,
            username,
        });
      })
    } else {
      res.status(401).json('wrong credentials');
    }
  }else {
    return res.status(401).json('no such user');
  }
});

app.post('/register', async (req, res) => {
    const { username, password } = req.body;
    const createdUser = await User.create({ 
      username:username, 
      password: bcrypt.hashSync(password), salt });
    // Create a JWT token with the user’s ID inside
    jwt.sign({userId:createdUser._id, username: createdUser.username},// payload (what’s inside the token)
        jwt_screte,// secret key (used to sign)
        (err, token) => {
        if(err) throw err;
        res.cookie('token', token, {sameSite:'none', secure:true}).status(201).json({
            id: createdUser._id,
            username,
        });
    })
});

const server = app.listen(3000, () => {
  console.log('Server is running on port 3000');
});

const wss = new ws.WebSocketServer({ server });
wss.on('connection', (connection,req) => {
  // wss.clients.forEach(client => client.send('new user connected'));
  const cookies = req.headers.cookie;
  if(cookies) {
    const tokenCookieString = cookies.split(';').find(str => str.startsWith('token='));
    if(tokenCookieString) {
      const token = tokenCookieString.split('=')[1];
      if(token) {
        jwt.verify(token, jwt_screte, {}, (err, userData) => {
          if(err) throw err;
          const { userId, username } = userData;
          connection.userId = userId;
          connection.username = username;
        });
      }
    }
  }

  [...wss.clients].forEach(client => {
    client.send(JSON.stringify({
      online: [...wss.clients].map(c => ({userId: c.userId, username: c.username})),
    }
    ))
  })
});

//3bA2mzebz7prQoFs