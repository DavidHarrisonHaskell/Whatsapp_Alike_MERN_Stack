
const userRepository = require('../repositories/userRepository');
const getUserById = (id) => {
    return userRepository.getUserById(id);
};

const getAllUsers = () => {
    return userRepository.getAllUsers();
};

module.exports = {
    getUserById,
    getAllUsers
};
