const Room = require('../models/room.js');

exports.roomFeed = async (req, res, next) => {
    try {
      const rooms = await Room.find().lean().populate([
        { path: 'participants', select: '-password -email' },
        { path: 'host', select: '-password -email' },
        { path: 'topic' },
      ]).sort({ createdAt: -1 });
  
      if (!rooms) {
        res.status(404);
        throw new Error('Rooms not found');
      }
  
      const roomsWithParticipantCount = rooms.map(room => ({
        ...room,
        participantsCount: room.participants.length
      }));
  
      return res.status(200).json(roomsWithParticipantCount);
    } catch (error) {
      console.log('error in roomFeedcontroller', error);
      res.status(500);
      return next(new Error('Error occurred while fetching rooms'));
    }
  };
  