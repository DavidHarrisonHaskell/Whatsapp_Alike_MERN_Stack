const chatModel = require("../models/chatModel");

const createChat = (participants) => {
    // create new chat using mongoose chatModel
    const newChat = new chatModel({ participants });
    return newChat.save();
};

const getChatsByUserId = (userId) => {
    // get all chats where userId is a participant
    return chatModel.find({ participants: userId }); // mongoose method to find documents in a collection
    // where the value of a specified field in each document matches the value provided in the query.
    //explanation of find method: https://docs.mongodb.com/manual/reference/method/db.collection.find/
}

module.exports = {
    createChat,
    getChatsByUserId
};