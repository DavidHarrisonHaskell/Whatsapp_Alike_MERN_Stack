// use for handling messages
/*
like sending messages,
receiving messages,
fetching conversation history
*/

const express = require('express');
const router = express.Router();

const chatService = require('../services/chatService');
const { verifyUser } = require('../middlewares/authMiddleware');

// Endpoint for sending a message

router.post('/new-chat', verifyUser, async (req, res) => {
    try {
        const { participants } = req.body;
        if (!participants || participants.length < 2) {
            return res.status(400).json({ message: 'At least two participants are required' });
        }
        const newChat = await chatService.createChat(participants);
        res.status(201).json({ success: true, chat: newChat });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ success: false, message: error.message });
    }
})

// getting all chats for a user

router.get('/:id', verifyUser, async (req, res) => {
    try {
        const { id } = req.params;
        const chats = await chatService.getChatsByUserId(id);
         res.status(200).json({ success: true, chats });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ success: false, message: error.message });
    }
})

module.exports = router;


