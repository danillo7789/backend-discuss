const User = require('../models/user.js');
const cloudinary = require('../utils/cloudinary.js');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

exports.registerUser = async (req, res, next) => {
    try {
      const { email, password, username } = req.body;
      if (!email || !password || !username) {
        res.status(400);
        throw new Error('All fields are required');
      }
  
      if (password.length < 8) {
        res.status(400);
        throw new Error('Password must be up to 8 characters');
      }
  
      const emailExists = await User.findOne({ email });
      if (emailExists) {
        res.status(400);
        throw new Error('Email already exists');
      }
  
      const usernameExists = await User.findOne({ username });
      if (usernameExists) {
        res.status(400);
        throw new Error('Username already taken');
      }
  
      const user = new User({
        username,
        email,
        password,
      });
  
      await user.save();
  
      if (req.file) {
        try {
          const result = await cloudinary.uploader.upload(req.file.path, { resource_type: 'auto' });
          user.profilePicture = {
            url: result.secure_url,
            name: result.original_filename,
          };
          await user.save();
        } catch (error) {
          res.status(400);
          return next(new Error('An error occurred uploading the profile picture'));
        }
      }
      return res.status(201).json(user);
    } catch (error) {
        if (error.name === 'ValidationError') {
          const messages = Object.values(error.errors).map((err) => err.message);
          res.status(400);
          return next(new Error(messages[0]));
        } else if (error.name === 'MongoNetworkError' || error.code === 'ETIMEOUT') {
          res.status(503);
          return next(new Error('Service Unavailable. Please check your internet connection and try again.'));
        } else {
          console.log('Error occurred in registering user', error);
          res.status(500);
          return next(new Error('Error occurred in registering user.'));
        }
      }
  };
  


exports.loginUser = async (req, res, next) => {
    try {
        const { access, password } = req.body;
        if (!access || !password) {
            return res.status(400).json({ message: 'All fields are required to login' });
        }

        const user = await User.findOne({ $or: [{ email: access }, { username: access }] });
        if (!user) return res.status(404).json({ message: 'User does not exist' });

        const isMatch = await bcrypt.compare(password, user.password);
        if (user && isMatch) {
            const currentUser = {
                id: user.id,
                email: user.email,
                username: user.username
            }
            console.log(currentUser);
            const token = jwt.sign({user: currentUser},
                process.env.ACCESS_TOKEN_SECRET,
                { expiresIn: '12h' }
            );
            res.status(200).json({ token })
        } else {
            res.status(401);
            throw new Error({ message: 'Invalid login credentials' });
        }
    } catch (error) {
        if (error.name === 'MongoNetworkError' || error.code === 'ETIMEOUT') {
            res.status(503);
            return next(new Error('Service Unavailable. Please check your internet connection and try again.'));
          }
        console.log('There was an error logging the user in', error);
        res.status(500);
        next(new Error( 'There was an error logging the user in' ));
    }
}