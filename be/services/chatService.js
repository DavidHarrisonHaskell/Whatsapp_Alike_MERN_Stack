
const chatRepository = require("../repositories/chatRepository");
const messageRepository = require("../repositories/messageRepository");
const createChat = (participants) => {
    const result = chatRepository.createChat(participants);
    return result;
} 

const getChatsByUserId = (userId) => {
    const chats = chatRepository.getChatsByUserId(userId);
    // console.log("chats:", chats);
    return chats;
    // console.log(chats);
    // const chatsWithMessages = chats.map(chat => {
    //     const messages = messageRepository.getMessagesByChatId(chat._id);
    //     return {
    //         _id: chat._id,
    //         participants: chat.participants,
    //         messages
    //     }
    // })
    // return chatsWithMessages;
}

module.exports = {
    createChat,
    getChatsByUserId
};