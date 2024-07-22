const Room = require('../models/room.js');
const Topic = require('../models/topic.js');
const Chat = require('../models/chat.js');

exports.getRoom = async (req, res) => {
    try {
        const room = await Room.findById(req.params.id).populate([
            { path: 'participants', select: '-email -password' },
            { path: 'host', select: '-email -password' },
            { path: 'chats', populate: { path: 'sender', select: '-email -password' } },
            { path: 'topic' },
        ]).lean();
          

        if (!room) res.status(404).json({ message: 'Room not found' });

        const roomWithTotalParticipantCount = {
            ...room,
            totalParticipants: room.participants.length
        }

        return res.status(200).json(roomWithTotalParticipantCount);
    } catch (error) {
        console.log('Error occurred in fetching room', error);
        return res.status(500).json({ message: 'Error occurred in fetching room' });
    }
}


exports.createRoom = async (req, res) => {
    try {
      const { name, topic, description } = req.body;
      if (!name || !topic) {
        return res.status(400).json({ message: 'Please fill room name and topic' });
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
      return res.status(500).json({ message: 'Error creating room' });
    }
};


exports.updateRoom = async (req, res) => {
    try {
        const { name, topic, description } = req.body;
        const room = await Room.findById(req.params.id);
        if (!room) return res.status(404).json({ message: 'Room not found' });

        if (name) room.name = name;
        if (description) room.description = description;
        if (topic) {
            const trimTopic = topic.toLowerCase();
            let existingTopic = await Topic.findOne({ name: trimTopic });
        
            if (!existingTopic) {
                existingTopic = new Topic({ name: trimTopic });
                await existingTopic.save();
            }
            room.topic = existingTopic._id;
        }
        await room.save();
        return res.status(200).json(room);
    } catch (error) {
        console.error('Error updating room', error)
        return res.status(500).json({ message: 'Error updating room' });
    }
}


exports.deleteRoom = async (req, res) => {
    try {
        const room = await Room.findById(req.params.id);
        if (!room) res.status(404).json({ message: 'Room not found' });

        await Chat.deleteMany({ room: room._id });
        await Room.deleteOne({ _id: room._id });

        return res.status(200).json({ message: 'Room successfully deleted' });
    } catch (error) {
        console.error('Error deleting room:', error);
        res.status(500).json({ message: 'Error deleting room' });
    }
}


  