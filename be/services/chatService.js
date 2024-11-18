
const chatRepository = require("../repositories/chatRepository");
const createChat = (participants) => {
    const result = chatRepository.createChat(participants);
    return result;
} 

const getChatsByUserId = (userId) => {
    const result = chatRepository.getChatsByUserId(userId);
    return result;
}

module.exports = {
    createChat,
    getChatsByUserId
};