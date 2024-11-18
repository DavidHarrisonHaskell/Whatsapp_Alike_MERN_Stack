const userModel = require('../models/userModel')

const getUserById = async (id) => {
    const result = await userModel.findById(id)
    return result
}

const getAllUsers = async () => {
    const result = await userModel.find()
    return result
}

module.exports = {
    getUserById,
    getAllUsers
}