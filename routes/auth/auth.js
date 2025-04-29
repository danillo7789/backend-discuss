const express = require('express');
const router = express.Router();
const {
  registerUser,
  loginUser,
  refresh,
  logout,
  forgotPassword,
  resetPassword,
} = require('../../controllers/onboardingAuth.js');
const {
  createRateLimiter,
  defaultLimiter,
} = require('../../middleware/rateLimiter.js');

const loginRefreshLimitter = createRateLimiter(2, 10, 'login');

router.post('/register', registerUser);
router.post('/login', loginRefreshLimitter, loginUser);
router.get('/refresh', defaultLimiter, refresh);
router.post('/logout', defaultLimiter, logout);
router.post('/forgot-password', defaultLimiter, forgotPassword);
router.post('/reset-password', defaultLimiter, resetPassword);

module.exports = router;
