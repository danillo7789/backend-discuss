const express = require('express');
const { validateToken } = require('../../middleware/validateToken');
const { getUser } = require('../../controllers/profile');
const router = express.Router();

router.get('/user/:id', validateToken, getUser);

module.exports = router;