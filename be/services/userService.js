
const userRepository = require('../repositories/userRepository');
const chatRepository = require('../repositories/chatRepository');
const getUserInformation = (id) => {
    // const user = userRepository.getUserById(id);
    const users = userRepository.getAllUsers();
    // find users who have chats with the given user
    // const chats = chatRepository.getChatsByUserId(id);
    // const friends = users.filter((u) => chats.some((c) => c.user_id === u._id));
    return users
};

const getAllUsers = () => {
    return userRepository.getAllUsers();
};

module.exports = {
    getUserInformation,
    getAllUsers
};
