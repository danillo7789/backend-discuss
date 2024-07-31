const User = require('../models/user.js');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

const isDevelopment = process.env.NODE_ENV === 'development';

exports.registerUser = async (req, res) => {
  try {
    const { email, password, username } = req.body;
    if (!email || !password || !username) {
      return res.status(400).json({ message: 'All fields are required' });
    }

    if (password.length < 8) {
      return res.status(400).json({ message: 'Password must be up to 8 characters' });
    }

    const emailExists = await User.findOne({ email });
    if (emailExists) {
      return res.status(400).json({ message: 'Email already exists' });
    }

    const usernameExists = await User.findOne({ username });
    if (usernameExists) {
      return res.status(400).json({ message: 'Username already taken' });
    }

    const user = new User({
      username,
      email,
      password,
    });

    await user.save();
    res.status(201).json({ message: 'Registration Successful!' });
  } catch (error) {
      if (error.name === 'ValidationError') {
        const messages = Object.values(error.errors).map((err) => err.message);
        return res.status(400).json({ message: messages[0] });
      } else if (error.name === 'MongoNetworkError' || error.code === 'ETIMEOUT') {
        return res.status(503).json({ message: 'Service Unavailable. Please check your internet connection and try again.' });
      } else {
        console.log('Error occurred in registering user', error);
        return res.status(500).json({ message: 'Error occurred in registering user.' });
      }
    }
};


exports.loginUser = async (req, res) => {
  try {
    const { access, password } = req.body;
    if (!access || !password) {
      return res.status(400).json({ message:  'All fields are required to login'  });
    }

    const user = await User.findOne({ $or: [{ email: access }, { username: access }] });
    if (!user) {
      return res.status(401).json({ message:  'Invalid login credentials'  });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (user && isMatch) {
      const currentUser = {
          id: user.id,
          email: user.email,
          username: user.username,
      }
      
      const token = jwt.sign(
        { user: currentUser },
        process.env.ACCESS_TOKEN_SECRET,
        { expiresIn: '10m' }
      );

      const refreshToken = jwt.sign(
        { userId: user.id },
        process.env.REFRESH_TOKEN_SECRET,
        { expiresIn: '7d' }
      )
      //creating secure cookie with refresh token
      res.cookie('jwt', refreshToken, {
        httpOnly: true, //accessible only by web server
        secure: isDevelopment ? false : true, // https
        sameSite: isDevelopment ? 'Lax' : 'None', // backend and frontend might be on diff servers
        maxAge: 7 * 24 * 60 * 60 * 1000
      })

      // const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
      return res.status(200).json({ token })
    } else {
      return res.status(401).json({ message: 'Invalid login credentials' });
    }
  } catch (error) {
    if (error.name === 'MongoNetworkError' || error.code === 'ETIMEOUT') {
        return res.status(503).json({ message: 'Service Unavailable. Please check your internet connection and try again.' });
    } else {
      console.log('There was an error logging the user in', error);
      return res.status(500).json({ message:  'There was an error logging the user in'  });
    }
  }
}

exports.refresh = async (req, res) => {
  try {
    const cookies = req.cookies;
    if (!cookies?.jwt) return res.status(401).json({ message: 'unauthorized' });

    const refreshToken = cookies.jwt;

    jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET, async (err, decoded) => {
      if (err) return res.status(403).json({ message: 'Forbidden' });

      const foundUser = await User.findOne({ _id: decoded.userId });
      
      if (!foundUser) return res.status(401).json({ message: 'unAauthorized' });

      const currentUser = {
        id: foundUser.id,
        email: foundUser.email,
        username: foundUser.username,
      }

      //create new accessToken
      const newToken = jwt.sign(
        { user: currentUser },
        process.env.ACCESS_TOKEN_SECRET,
        { expiresIn: '10m' }
      )

      res.status(200).json({ token: newToken });
    })
  } catch (error) {
    console.error('refresh token error', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
}

exports.logout = async (req, res) => {
  try {
    const cookies = req.cookies;
    if (!cookies?.jwt) return res.sendStatus(204);
    res.clearCookie('jwt', {
      httpOnly: true,
      sameSite: isDevelopment ? 'Lax' : 'None',
      secure: isDevelopment ? false : true
    });
    res.json({ message: 'cookie cleared' });
    
  } catch (error) {
    console.error('error clearing cookie', error)
  }
}