const Room = require('../models/room.js');
const Chat = require('../models/chat.js');

exports.postChat = async (req, res) => {
    try {
        const room = await Room.findById(req.params.id);
        const { message } = req.body;
        if (!room) return res.status(404).json({ message: 'Room not found' });

        if (!message || message.trim() === "") {
            return res.status(404).json({ message: 'Please enter a valid text' });
        }

        const chat = new Chat({
            sender: req.user.id,
            text: message,
            room: room._id
        });
        await chat.save();
        room.chats.push(chat._id)

        const participantExist = room.participants.some(participant => participant.equals(req.user.id));
        if (!participantExist) room.participants.push(req.user.id);

        await room.save();
        return res.status(201).json(chat);

    } catch (error) {
        console.log('Error occured sending chat', error);
        return res.status(500).json({ message: 'Error occured sending chat' });
    }
}


exports.getChats = async (req, res) => {
    try {
        const room = await Room.findById(req.params.id);
        const chats = await Chat.find({ room: room._id }).populate({
            path: 'sender', select: '-email -password'
        });

        if (!room) return res.status(404).json({ message: 'Room not found' });

        if (!chats) return res.status(404).json({ message: 'No chats found' });
        
        const updatedRoom = await Room.findById(req.params.id).populate({
            path: 'participants', select: '-email -password'
        }); 

        return res.status(200).json({
            chats,
            updatedRoom
        });

    } catch (error) {
        console.log('Error occured getting room chats', error);
        return res.status(500).json({ message: 'Error getting room chats' });
    }
}

exports.AllChats = async (req, res) => {
    try {
        const chats = await Chat.find().populate([
            { path: 'sender', select: '-email -password' },
            { path: 'room', select: '-participants -chats', 
                populate: [
                    { path: 'host', select: '-email -password' },
                    { path: 'topic' }
                ]}
        ]).sort({ createdAt: -1 });

        if (!chats) return res.status(404).json({ message: 'No chats found' });

        return res.status(200).json(chats);

    } catch (error) {
        console.log('Error occured getting all chats for activity', error);
        return res.status(500).json({ message: 'Error getting all chats activity' });
    }
}


exports.deleteChat = async (req, res) => {
    try {
        const chatId = req.params.id;
        const userId = req.user.id;

        const chat = await Chat.findById(chatId);
        if (!chat) return res.status(404).json({ message: 'Chat not found' });

        const room = await Room.findById(chat.room);
        if (!room) return res.status(404).json({ message: 'Room not found' });

        // Remove the chat from the room's chats array
        room.chats.pull(chatId);
        await Chat.deleteOne({ _id: chat._id });

        // Check if the user has any other chats in the room
        const userChats = await Chat.find({ room: room._id, sender: userId });
        if (userChats.length === 0) {
            room.participants.pull(userId);
        }
        await room.save();

        return res.status(200).json({ message: 'Chat deleted successfully', deleted: {_id: chatId} });
    } catch (error) {
        console.log('Error occurred deleting chat', error);
        return res.status(500).json({ message: 'Error occurred deleting chat' });
    }
};
