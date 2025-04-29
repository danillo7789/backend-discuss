const express = require('express');
const { createAndUpdate, batchSyncStudents } = require('../controllers/testSaas');
const router = express.Router();

router.post('/create-student', createAndUpdate);
router.post('/batch-update', batchSyncStudents);

module.exports = router;