const jwt = require('jsonwebtoken');
const isProduction = process.env.NODE_ENV === 'production';

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
    secure: isProduction, // https
    sameSite: isProduction ? 'none' : 'lax',
    path: '/',    
    maxAge: 15 * 60 * 1000,
  });

  res.cookie('jwt', refreshToken, {
    httpOnly: true, //not accessible by clientside js
    secure: isProduction, // https
    sameSite: isProduction ? 'none' : 'lax',
    path: '/',    
    maxAge: 7 * 24 * 60 * 60 * 1000,
  });
};

module.exports = { generateTokens, setTokens };
