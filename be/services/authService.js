const authRepository = require('../repositories/authRepository');

const getAllUsers = () => {
    return authRepository.getAllUsers();
}

const getUserByEmail = (email) => {
    return authRepository.getUserByEmail(email);
}

const createUser = (user) => {
    return authRepository.createUser(user);
}

module.exports = {
    getAllUsers,
    getUserByEmail,
    createUser,
};
