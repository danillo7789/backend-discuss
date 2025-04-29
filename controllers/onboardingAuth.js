const User = require('../models/user.js');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const { generateTokens, setTokens } = require('../utils/tokens.js');
const { sendMail } = require('../utils/elasticMail.js');
const logger = require('../utils/logger.js');

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
        logger.error('Error occurred in registering user', {error});
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

    const isMatch = await user.comparePassword(password);
    if (isMatch) {
      const currentUser = {
        id: user.id,
        email: user.email,
      }

      const { accessToken, refreshToken } = generateTokens(currentUser, user.id);
      setTokens(res, accessToken, refreshToken);

      return res.status(200).json({ token: accessToken })
    } else {
      logger.error('Invalid login credentials.');
      return res.status(401).json({ message: 'Invalid login credentials' });
    }
  } catch (error) {
    if (error.name === 'MongoNetworkError' || error.code === 'ETIMEOUT') {
        return res.status(503).json({ message: 'Service Unavailable. Please check your internet connection and try again.' });
    } else {
      logger.error('Error occurred in logging user in', {error});     
      return res.status(500).json({ message:  'There was an error logging the user in'  });
    }
  }
}


exports.refresh = async (req, res) => {
  try {
    const cookies = req.cookies;
    if (!cookies?.jwt) return res.status(401).json({ message: 'Unauthorized' });

    const refreshToken = cookies?.jwt;

    jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET, async (err, decoded) => {
      if (err) return res.status(403).json({ message: 'Forbidden' });

      const foundUser = await User.findOne({ _id: decoded.userId });
      
      if (!foundUser) return res.status(401).json({ message: 'unAuthorized' });

      const currentUser = {
        id: foundUser.id,
        email: foundUser.email,
      }

      //create new accessToken and refreshToken
      const { accessToken: newToken, refreshToken: newRefreshToken } = generateTokens(currentUser, foundUser.id);
      setTokens(res, newToken, newRefreshToken);

      res.status(200).json({ token: newToken });
    })
  } catch (error) {
    console.error('refresh token error', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
}


exports.forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) return res.status(400).json({ message: 'Email is required' });

    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ message: 'Account does not exist' });

    user.passwordReset();
    await sendMail(user, email);
    await user.save();
    res.status(200).json({ message: 'Password reset link sent to your email'});
  } catch (error) {
   console.error('forgot password error', error);
   res.status(500).json({ message: 'Internal Server Error' }); 
  }
}

exports.resetPassword = async (req, res) => {
  try {
    const { newPassword, confirmNewPassword, resetToken} = req.body;
    if (!newPassword || !confirmNewPassword) return res.status(400).json({ message: 'All fields are required' });
    if (newPassword !== confirmNewPassword) return res.status(400).json({ message: 'Passwords do not match' });

    const user = await User.findOne({ passwordResetToken: resetToken });
    if (!user) return res.status(404).json({ message: 'Invalid Token' });

    const now = Date.now();
    if (now > user.passwordResetExpires) {
      user.passwordResetToken = null;
      user.passwordResetExpires = null;
      await user.save();
      return res.status(400).json({ message: 'Token has expired' });
    }
    user.password = newPassword;
    user.passwordResetToken = null;
    user.passwordResetExpires = null;
    await user.save();
    res.status(200).json({ message: 'Password reset successful' });

  } catch (error) {
    console.error('reset password error', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
}

exports.logout = async (req, res) => {
  try {
    const cookies = req.cookies;
    if (!cookies?.jwt) return res.sendStatus(204);
    res.clearCookie('jwt', {
      httpOnly: true,
      sameSite: isDevelopment ? 'lax' : 'none',
      secure: isDevelopment ? false : true
    });
    res.clearCookie('accesstoken', {
      httpOnly: true,
      sameSite: isDevelopment ? 'lax' : 'none',
      secure: isDevelopment ? false : true
    });
    res.json({ message: 'Logged out' });
    
  } catch (error) {
    console.error('error clearing cookie', error)
  }
}