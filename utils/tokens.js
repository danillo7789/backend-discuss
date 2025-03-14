const jwt = require('jsonwebtoken');
const isDevelopment = process.env.NODE_ENV === 'development';

const generateTokens = (currentUser, userId) => {
  const accessToken = jwt.sign(
    { user: currentUser },
    process.env.ACCESS_TOKEN_SECRET,
    { expiresIn: '15m' }
  );

  const refreshToken = jwt.sign(
    { userId: userId },
    process.env.REFRESH_TOKEN_SECRET,
    { expiresIn: '7d' }
  );

  return { accessToken, refreshToken };
};

const setTokens = (res, token, refreshToken) => {
  res.cookie('accesstoken', token, {
    httpOnly: true, //not accessible by clientside js
    secure: isDevelopment ? false : true, // https
    sameSite: isDevelopment ? 'lax' : 'none',
    path: '/',
    maxAge: 15 * 60 * 1000,
  });

  res.cookie('jwt', refreshToken, {
    httpOnly: true, //not accessible by clientside js
    secure: isDevelopment ? false : true, // https
    sameSite: isDevelopment ? 'lax' : 'none',
    path: '/',
    maxAge: 7 * 24 * 60 * 60 * 1000,
  });
};

module.exports = { generateTokens, setTokens };
