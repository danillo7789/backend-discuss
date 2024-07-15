const express = require('express');
const router = express.Router();
const { upload } = require('../../middleware/multer.js');
const { registerUser, loginUser } = require('../../controllers/onboarding.js');
const multer = require('multer');

router.use((err, req, res, next) => {
    if (err instanceof multer.MulterError && err.code === 'LIMIT_FILE_SIZE') {
      return res.status(400).json({ message: 'File size limit exceeded' });
    }
    next(err);
  });
  

router.post('/register', upload.single('profilePicture'), registerUser);
router.post('/login', loginUser);

module.exports = router;