const express = require('express');
const router = express.Router();
const passport = require('../../utils/passport');
const { setTokens, generateTokens } = require('../../utils/tokens');


router.get(
  '/google',
  passport.authenticate('google', { scope: ['profile', 'email'] })
);

router.get(
  '/google/callback',
  passport.authenticate('google', { failureRedirect: '/login' }),
  (req, res) => {    
    const payload ={
      id: req.user._id,
      email: req.user.email
    }
    const { accessToken, refreshToken } = generateTokens(payload, req.user._id);
    setTokens(res, accessToken, refreshToken);    
    res.redirect('https://diskors.netlify.app'); //vite react dev homepage
  }
);

module.exports = router;