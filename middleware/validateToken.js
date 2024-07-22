const jwt = require('jsonwebtoken');
// const users = require('../middleware/users.js');

const validateToken = async (req, res, next) => {
  try {
    let authHeader = req.headers.Authorization || req.headers.authorization;
    if (authHeader && authHeader.startsWith('Bearer ')) {
      const token = authHeader.split(' ')[1];
      jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, decoded) => {
        if (err) {
          if (err.name === 'TokenExpiredError') {
            return res.status(401).json({ message: 'Token expired' });
          } else {
            console.log(err)
            return res.status(401).json({ message: 'Failed to authenticate token' });
          }
        }
        req.user = decoded.user;
        next();
      });
    } else {
      return res.status(401).json({ message: 'Token is missing or invalid' });
    }
  } catch (error) {
    return res.status(401).json({ message: 'User not authorized or token expired' });
  }
};

// const validateToken = async (req, res, next) => {
//   try {
//     let token = req.cookies.token;

//     if (!token) {
//       return res.status(401).json({ message: 'unAuthenticated, please login' });
//     }

//     jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, decoded) => {
//       if (err) {
//         return res.status(401).json({ message: 'User is not authorized, please login' });
//       }
//       else if (decoded.user) {
//          req.user = decoded.user;
//       } else {
//         return res
//           .status(401)
//           .json({ message: 'Authentication failed, kindly login' });
//       }
//       next();
//     });

//   } catch (error) {
//     res.clearCookie('token');
//     console.log(error);
//     return res
//       .status(500)
//       .json({ message: 'Error occurred while validating the user' });
//   }
// };

module.exports = { validateToken };