const jwt = require('jsonwebtoken');
// const users = require('../middleware/users.js');

// const validateToken = async (req, res, next) => {
//   try {
//     let authHeader = req.headers.Authorization || req.headers.authorization;
//     if (authHeader && authHeader?.startsWith('Bearer ')) {
//       const token = authHeader.split(' ')[1];

//       jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, decoded) => {
//         if (err) {
//           if (err.name === 'TokenExpiredError') {
//             return res.status(401).json({ message: 'Token expired, please login' });
//           } else {
//             console.log('validdate token err', err)
//             return res.status(401).json({ message: 'Failed to authenticate token' });
//           }
//         }
//         req.user = decoded.user;
//         next();
//       });
//     } else {
//       return res.status(401).json({ message: 'Token is missing or invalid' });
//     }
//   } catch (error) {
//     return res.status(401).json({ message: 'User not authorized' });
//   }
// };

const validateToken = async (req, res, next) => {
  try {
    const token = req.cookies.accesstoken
    if (!token) return res.status(401).json({ message: 'User not authorized' });

    const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET)
    req.user = decoded.user;
    // console.log('new validate token', req.user)
    next();
  } catch (error) {
    return res.status(401).json({ message: 'User not authorized' });
  }
};

module.exports = { validateToken };