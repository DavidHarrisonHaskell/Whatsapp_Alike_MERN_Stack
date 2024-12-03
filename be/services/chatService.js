
const chatRepository = require("../repositories/chatRepository");
const messageRepository = require("../repositories/messageRepository");
const createChat = async (participants) => {
    const allChats = await chatRepository.getAllChats()
    // Sort participants array to ensure consistent order
    const sortedParticipants = participants.slice().sort();

    // Check if the chat already exists
    const existingChat = allChats.find((chat) => {
        const sortedChatParticipants = chat.participants.map(p => p.toString()).slice().sort();
        console.log("Sorting chat participants", sortedChatParticipants)
        return sortedParticipants.length === sortedChatParticipants.length &&
            sortedParticipants.every((p, index) => p === sortedChatParticipants[index]);
    })
    console.log('sortedParticipants', sortedParticipants)
    console.log('existing chat', existingChat)
    if (existingChat) {
        console.log('existingChat', existingChat)
        const error = new Error("A Chat between participants already exists")
        error.statusCode = 404
        throw error;
    }
    const result = chatRepository.createChat(participants);
    return result;
}

const getChatsByUserId = async (userId) => {
    const chats = await chatRepository.getChatsByUserId(userId);
    // console.log("chats:", chats);
    console.log(chats);
    const chatsWithMessages = await Promise.all(chats.map(async (chat) => {
        const messages = await messageRepository.getMessagesByChatId(chat._id);
        return {
            ...chat.toObject(),
            messages: messages
        }
    }))
    return chatsWithMessages;
}

const clearUnreadMessages = async (id) => {
    const chat = await chatRepository.getChatByChatId(id);
    // clear unread messages count
    const updatedChat = await chatRepository.clearChatUnreadMessagesCount(chat._id, chat.toObject());
    // set all messages in that chat to read
    const updatedMessages = await messageRepository.updateChatMessagesRead(id)
    return { updatedChat: updatedChat, updatedMessages: updatedMessages}
}

module.exports = {
    createChat,
    getChatsByUserId,
    clearUnreadMessages
};