
const messageRepository = require("../repositories/messageRepository")

// Create a new message in the database
const createMessage = async (sender, chatId, content) => {
    const result = await messageRepository.createMessage(sender, chatId, content)
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