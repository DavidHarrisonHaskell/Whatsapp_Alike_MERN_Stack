const userModel = require('../models/userModel');

const getAllUsers = async () => {
    const users = await userModel.find({});
    return users;
}

const getUserByEmail = async (email) => {
    const user = await userModel.findOne({ email }); // explanation: using findOne instead of find to return only the first match
    return user;
}

const createUser = async (user) => {
    const newUser = new userModel(user);
    await newUser.save();
    return newUser;
}

module.exports = {
    getAllUsers,
    getUserByEmail,
    createUser,
};