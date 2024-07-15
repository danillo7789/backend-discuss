const Room = require('../models/room.js');
const Topic = require('../models/topic.js');
const Chat = require('../models/chat.js');

exports.getRoom = async (req, res, next) => {
    try {
        const room = await Room.findById(req.params.id).populate([
            { path: 'participants', select: '-email -password' },
            { path: 'host', select: '-email -password' },
            { path: 'chats' },
            { path: 'topic' },
        ]).lean();

        if (!room) {
            res.status(404);
            throw new Error('Room not found');
        }

        const roomWithTotalParticipantCount = {
            ...room,
            totalParticipants: room.participants.length
        }

        return res.status(200).json(roomWithTotalParticipantCount);
    } catch (error) {
        console.log('Error occurred in fetching room', error);
        res.status(500);
        next(new Error('Error occurred in fetching room'));
    }
}


exports.createRoom = async (req, res, next) => {
    try {
      const { name, topic, description } = req.body;
      if (!name || !topic) {
        res.status(400);
        throw new Error('Please fill room name and topic');
      }
  
      const trimTopic = topic.toLowerCase();
      let existingTopic = await Topic.findOne({ name: trimTopic });
  
      if (!existingTopic) {
        existingTopic = new Topic({ name: trimTopic });
        await existingTopic.save();
      }
  
      const room = new Room({
        name,
        description,
        topic: existingTopic._id,
        host: req.user.id
      });
  
      await room.save();
  
      return res.status(201).json(room);
    } catch (error) {
      console.error('Error creating room:', error);
      res.status(500);
      next(new Error('Error creating room'));
    }
};


exports.deleteRoom = async (req, res, next) => {
    try {
        const room = await Room.findById(req.params.id);
        if (!room) {
            res.status(404);
            throw new Error('Room not found');
        }
        await Chat.deleteMany({ room: room._id });
        await Room.deleteOne({ _id: room._id });

        res.status(200).json({ message: 'Room successfully deleted' });
    } catch (error) {
        console.error('Error deleting room:', error);
        res.status(500);
        next(new Error('Error deleting room'));
    }
}


  