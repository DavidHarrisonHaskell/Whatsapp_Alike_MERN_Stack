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


const updateChatMessagesRead = async (id) => {
    // update chat messages read status
    const result = await messageModel.updateMany(
        { chatId: id },
        { $set: { read: true } }
    )
    return result;
}


module.exports = {
    createMessage,
    getMessagesByChatId,
    updateChatMessagesRead
};