const express = require('express');
const { validateToken } = require('../../middleware/validateToken');
const { profileUpdate } = require('../../controllers/profile');
const router = express.Router();
const multer = require('multer');
const { upload } = require('../../middleware/multer');

router.use((err, req, res, next) => {
  if (err instanceof multer.MulterError && err.code === 'LIMIT_FILE_SIZE') {
    return res.status(400).json({ message: 'File size limit exceeded' });
  }
  next(err);
});

router.put('/user-update/:id', validateToken, upload.single('profilePicture'), profileUpdate);

module.exports = router;