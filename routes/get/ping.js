const express = require('express');
const { getPing } = require('../../controllers/ping');
const router = express.Router();

router.get('/ping', getPing);

module.exports = router;