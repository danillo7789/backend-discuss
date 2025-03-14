const express = require('express');
const { validateToken } = require('../../middleware/validateToken');
const { getUser } = require('../../controllers/profile');
const { defaultLimiter } = require('../../middleware/rateLimiter');
const router = express.Router();

router.get('/user/:id', validateToken, defaultLimiter, getUser);

module.exports = router;