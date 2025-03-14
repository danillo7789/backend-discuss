const express = require('express');
const router = express.Router();
const { registerUser, loginUser, refresh, logout } = require('../../controllers/onboarding.js');
const { createRateLimiter, defaultLimiter } = require('../../middleware/rateLimiter.js');
  
const loginRefreshLimitter = createRateLimiter(2, 10, 'login');

router.post('/register', loginRefreshLimitter, registerUser);
router.post('/login', loginRefreshLimitter, loginUser);
router.get('/refresh', defaultLimiter, refresh)
router.post('/logout', defaultLimiter, logout)

module.exports = router;