const chatModel = require("../models/chatModel");

const createChat = (participants) => {
    // create new chat using mongoose chatModel
    const newChat = new chatModel({ participants });
    return newChat.save();
};

const updateChatUnreadMessagesCount = async (chatId) => {
    // update unreadMessageCount in the chat document
    const result = await chatModel.findByIdAndUpdate(chatId, { $inc: { unreadMessagesCount: 1 } }, { new: true });
    console.log(result);
    return result
}

const getAllChats = () => {
    // get all chats
    return chatModel.find({}); // mongoose method to find documents in a collection
    // explanation of find method: https://docs.mongodb.com/manual/reference/method/db.collection.find/
}
const getChatsByUserId = (userId) => {
    // get all chats where userId is a participant
    return chatModel.find({ participants: userId }); // mongoose method to find documents in a collection
    // where the value of a specified field in each document matches the value provided in the query.
    //explanation of find method: https://docs.mongodb.com/manual/reference/method/db.collection.find/
}

module.exports = {
    createChat,
    updateChatUnreadMessagesCount,
    getChatsByUserId,
    getAllChats
};