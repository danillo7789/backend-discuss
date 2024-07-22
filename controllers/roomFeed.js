const Room = require('../models/room.js');

exports.roomFeed = async (req, res) => {
  try {
    const rooms = await Room.find().lean().populate([
      { path: 'host', select: '-password -email' },
      { path: 'topic' },
    ]).sort({ createdAt: -1 });

    if (!rooms) return res.status(404).json({ message: 'Rooms not found' });

    const roomsWithParticipantCount = rooms.map(room => ({
      ...room,
      participantsCount: room.participants.length
    }));

    return res.status(200).json(roomsWithParticipantCount);
  } catch (error) {
    console.log('error in roomFeedcontroller', error);
    return res.status(500).json({ message: 'Error occurred while fetching rooms' });
  }
};
  