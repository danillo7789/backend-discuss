const Room = require('../models/room.js');
const Chat = require('../models/chat.js');

exports.postChat = async (req, res, next) => {
    try {
        const room = await Room.findById(req.params.id);
        const { message } = req.body;
        if (!room) {
            res.status(404);
            throw new Error('Room not found');
        }

        if (!message || message.trim() === "") {
            res.status(404);
            throw new Error('Please enter a valid text');
        }

        const chat = new Chat({
            sender: req.user.id,
            text: message,
            room: room._id
        });
        await chat.save();
        room.chats.push(chat._id)

        const participantExist = room.participants.some(participant => participant.equals(req.user.id));
        if (!participantExist) {
            room.participants.push(req.user.id);
        }

        await room.save();
        return res.status(201).json(chat);

    } catch (error) {
        console.log('Error occured sending chat', error);
        res.status(500);
        return next(new Error('Error occured sending chat'));
    }
}


exports.getChats = async (req, res, next) => {
    try {
        const room = await Room.findById(req.params.id);
        const chats = await Chat.find({ room: room._id }).populate({
            path: 'sender', select: '-email -password'
        });

        if (!room) {
            res.status(404);
            throw new Error('Room not found');
        }

        if (!chats) {
            res.status(404);
            throw new Error('No chats found');
        }
        
        const updatedRoom = await Room.findById(req.params.id).populate({
            path: 'participants', select: '-email -password'
        }); 

        return res.status(200).json({
            chats,
            updatedRoom
        });

        
    } catch (error) {
        console.log('Error occured getting room chats', error);
        res.status(500);
        return next(new Error('Error getting room chats'));
    }
}