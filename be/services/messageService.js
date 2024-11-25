
const messageRepository = require("../repositories/messageRepository")
const chatRepository = require("../repositories/chatRepository");

// Create a new message in the database
const createMessage = async (sender, chatId, content) => {
    const result = await messageRepository.createMessage(sender, chatId, content)
    await chatRepository.updateChatUnreadMessagesCount(chatId)
    return result
}
const getMessagesByChatId = async (chatId) => {
    const result = await messageRepository.getMessagesByChatId(chatId)
    return result
}


// Export the functions
module.exports = {
    createMessage,
    getMessagesByChatId
}