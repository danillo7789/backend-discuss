const User = require('../models/user.js');
const cloudinary = require('../utils/cloudinary.js');

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
            return res.status(503).json({ message: 'Service Unavailable. Please check your internet connection and try again.' });
        } else {
          console.log('There was an error fetching the user:', error);
          return res.status(500).json({ message:  'There was an error fetching the user'  });
        }
    }
}

exports.profileUpdate = async (req, res) => {
    try {
        const { email } = req.body;
        const user = await User.findById(req.params.id);

        if (!user) {
            return res.status(404).json({ message: 'User not found!' });
        }

        if (req.file) {
            try {
                const result = await cloudinary.uploader.upload(req.file.path, { resource_type: 'auto' });
                user.profilePicture = {
                    url: result.secure_url,
                    name: result.original_filename,
                };
            } catch (error) {
                console.error('Error occurred while uploading file:', error);
                return res.status(400).json({ message: 'An error occurred uploading the profile picture' });
            }
        }

        if (email) {
            user.email = email;
        }

        await user.save();
        return res.status(200).json(user);
    } catch (error) {
        if (error.name === 'MongoNetworkError' || error.code === 'ETIMEOUT') {
            return res.status(503).json({ message: 'Service Unavailable. Please check your internet connection and try again.' });
        } else {
            console.error('There was an error updating the user:', error);
            return res.status(500).json({ message: 'There was an error updating the user' });
        }
    }
};
