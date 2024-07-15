const multer = require('multer');

const storage = multer.diskStorage({
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname.trim()}`);
  },
});

const fileFilter = (req, file, cb) => {
  // reject a file
  if (
    file.mimetype === 'image/jpeg'
    || file.mimetype === 'image/png'
  ) {
    cb(null, true);
  } else {
    cb(new Error('Invalid mime type'));
  }
};

const upload = multer({
  storage,
  limits: { fileSize: 15 * 1024 * 1024 },
  fileFilter,
});

module.exports = { upload };