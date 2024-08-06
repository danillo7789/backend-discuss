const cloudinary = require('cloudinary').v2;

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_SECRET_KEY
});

// // Test file upload
// const testUpload = async () => {
//   try {
//     const result = await cloudinary.uploader.upload('C:/Users/USER/AppData/Local/Temp/1722776341289-space.jpg', {
//       resource_type: 'auto'
//     });
//     console.log('Upload result:', result);
//   } catch (error) {
//     console.error('Cloudinary upload error from them:', error);
//   }
// };

// testUpload();

module.exports = cloudinary;


