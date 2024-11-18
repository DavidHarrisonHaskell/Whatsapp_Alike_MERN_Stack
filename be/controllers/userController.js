// user actions for:
/*
blocking users,
unblocking users,
get user profile,
*/

const express = require('express');
const Router = express.Router();
const userService = require('../services/userService');
const { verifyUser } = require('../middlewares/authMiddleware');

require('dotenv').config();

// user routes

Router.get('/:id', verifyUser, async (req, res) => {
    try {
        const user = await userService.getUserById(req.params.id);
        // TODO: develop the getUserById function
        res.status(200).json({ success: true, user: user });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: error.message });
    }
})

Router.get('/', async (req, res) => {
    try {
        const users = await userService.getAllUsers();
        res.status(200).json({ success: true, users: users });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: error.message });
    }
})

module.exports = Router;
