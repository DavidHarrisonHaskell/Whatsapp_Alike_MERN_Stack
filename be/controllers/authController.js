// use for:
/*
logging in
 */

const express = require('express');
const Router = express.Router();
const authService = require('../services/authService');
const jwt = require('jsonwebtoken');
require('dotenv').config();
// Endpoint for user login

Router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;
        if (!email || !password) {
            return res.status(400).json({ message: 'Email and password are required' });
        }
        const users = await authService.getAllUsers();
        const user = users.find((u) => u.email === email && u.password === password);
        if (!user) {
            return res.status(401).json({ message: 'Invalid email or password' });
        }
        const secretKey = user.isAdmin ? process.env.ADMIN_SECRET_KEY : process.env.USER_SECRET_KEY;
        const token = jwt.sign({ user }, secretKey);
        res.status(200).json({ success: true, message: 'Login successful', token: token, admin: user.isAdmin, id: user._id, name: user.name });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'Internal server error' });
    }
});
Router.post('/register', async (req, res) => {
    const name = req.body.name
    const email = req.body.email
    const password = req.body.password
    try {
        if (!name || !email || !password) {
            return res.status(400).json({ message: 'Name, email and password are required' });
        } else {
            const existingUser = await authService.getUserByEmail(email);
            if (existingUser) {
                return res.status(409).json({ message: 'Email already exists' });
            }
            const newUser = await authService.createUser({ name, email, password });
            res.status(201).json({ success: true, message: 'User registered successfully', user: newUser });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: error.message });
    }
});

module.exports = Router;