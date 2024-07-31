const express = require('express');
const router = express.Router();
const { registerUser, loginUser, refresh, logout } = require('../../controllers/onboarding.js');
  

router.post('/register', registerUser);
router.post('/login', loginUser);

router.get('/refresh', refresh)
router.post('/logout', logout)

module.exports = router;