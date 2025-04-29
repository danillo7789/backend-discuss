const User = require('../models/user.js');
const cloudinary = require('../utils/cloudinary.js');
const logger = require('../utils/logger.js');

exports.getUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id).lean();
    if (user) {
      const { password, ...userWithoutPassword } = user; // Destructuring to exclude the password field
      res.status(200).json(userWithoutPassword);
    } else {
      res.status(404).json({ message: 'User not found' });
    }
  } catch (error) {
    if (error.name === 'MongoNetworkError' || error.code === 'ETIMEOUT') {
      return res
        .status(503)
        .json({
          message:
            'Service Unavailable. Please check your internet connection and try again.',
        });
    } else {      
      logger.error('There was an error fetching the user', {error});
      return res
        .status(500)
        .json({ message: 'There was an error fetching the user' });
    }
  }
};

exports.profileUpdate = async (req, res) => {
  try {
    const { email, about } = req.body;
    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({ message: 'User not found!' });
    }

    if (!req.file && !email) {
      return res.status(403).json({ message: 'Nothing to update' });
    }

    if (req.file) {
      try {
        const result = await cloudinary.uploader.upload(req.file.path, {
          resource_type: 'auto',
        });
        
        user.profilePicture = {
          url: result.secure_url,
          name: result.original_filename,
        };
      } catch (error) {
        logger.error('An error occured uploading the profile picture', {error});
        return res
          .status(400)
          .json({ message: 'An error occurred uploading the profile picture' });
      }
    }

    if (email) user.email = email;

    if (about) user.about = about;

    await user.save();
    return res.status(200).json(user);
  } catch (error) {
    if (
      error.name === 'MongoNetworkError' ||
      error.name === 'MongooseServerSelectionError' ||
      error.code === 'ETIMEOUT'
    ) {
      return res
        .status(503)
        .json({
          message:
            'Service Unavailable. Please check your internet connection and try again.',
        });
    } else {
      logger.error('There was an error updating the user', {error});
      return res
        .status(500)
        .json({ message: 'There was an error updating the user' });
    }
  }
};
