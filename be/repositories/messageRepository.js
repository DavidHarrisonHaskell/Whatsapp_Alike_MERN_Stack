const messageModel = require("../models/messageModel");

const createMessage = (sender, chatId, content) => {
    const newMessage = new messageModel({
        sender: sender,
        chatId: chatId,
        content: content,
    });
    return newMessage.save();
};

const getMessagesByChatId = (chatId) => {
    return messageModel.find({ chatId: chatId }).sort({ createdAt: 1 }); // sort by createdAt in ascending order
};

module.exports = {
    createMessage,
    getMessagesByChatId
};