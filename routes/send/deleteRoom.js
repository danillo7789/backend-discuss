const express = require('express');
const { validateToken } = require('../../middleware/validateToken');
const { deleteRoom } = require('../../controllers/room');
const router = express.Router();

router.delete('/delete-room/:id', validateToken, deleteRoom);

module.exports = router;