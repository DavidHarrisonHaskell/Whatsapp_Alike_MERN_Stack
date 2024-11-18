const express = require('express');
const router = express.Router();
const messageService = require("../services/messageService")
const { verifyUser } = require('../middlewares/authMiddleware');

router.post('/new-message', verifyUser, async (req, res) => {
    try {
        const { sender, chatId, content } = req.body;
        if (!sender || !chatId || !content) {
            return res.status(400).json({ message: 'Sender, chatId, and content are required' });
        }
        const newMessage = await messageService.createMessage(sender, chatId, content);
        res.json({ success: true, message: newMessage });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error creating new message' });
    }
});

router.get('/:chatId', verifyUser, async (req, res) => {
    try {
        const chatId = req.params.chatId;
        if (!chatId) {
            return res.status(400).json({ message: 'ChatId is required' });
        }
        const messages = await messageService.getMessagesByChatId(chatId);
        res.json({ success: true, messages });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error retrieving messages' });
    }
});

module.exports = router;