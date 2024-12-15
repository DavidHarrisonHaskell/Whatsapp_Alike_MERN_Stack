const express = require('express');
const http = require('http');
const socketIO = require('socket.io');

const app = express(); // express app
const cors = require('cors'); // cors middleware
require("./configs/db"); // database configuration
app.use(express.json());
app.use(cors()); // enable cors middleware for all routes

const authController = require('./controllers/authController');
app.use('/auth', authController);
const userController = require('./controllers/userController');
app.use('/users', userController);
const chatController = require('./controllers/chatController');
app.use('/chats', chatController);
const messageController = require('./controllers/messageController');
app.use('/messages', messageController);

const socketServer = http.createServer(app);

const io = socketIO(socketServer, {
    cors: {
        origin: 'http://localhost:5173',
        methods: ['GET', 'POST']
    }
});

// Set up a socket.io connection event listener

io.on('connection', (socket) => {
    console.log('User connected with Socket ID: ' + socket.id);

    // Handle user disconnection
    socket.on('disconnect', () => {
        console.log('User disconnected', socket.id);
    });

    socket.on('send-message-all-clients', ({ text }) => {
        // console.log(text)
        // send to all clients
        socket.emit('send-message-by-server', `Message from server: ${text}`);
    })

    socket.on('join-room', (userId) => {
        socket.join(userId);
        console.log(`User ${userId} joined room`);
    })

    socket.on('send-message', (data) => {
        // console.log(`Sent ${data.content} to ${recipient}`);
        console.log("message arrived at server", data);
        io
        .to(data.members[0])
        .to(data.members[1])
        .emit('receive-message', data)
    })

    //     // Handle user sending a message
    //     socket.on('sendMessage', (message) => {
    //         console.log(`User ${message.userId} sent message: ${message.text}`);
    //         io.in(message.room).emit('message', message);
    //         // io.emit('receiveMessage', message);
    //     });

    //     // Handle user joining a room
    //     socket.on('joinRoom', ({ room, userId }) => {
    //         socket.join(room);
    //         console.log(`User ${userId} joined room ${room}`);

    //         // Broadcast a message to all users in the room
    //         io.in(room).emit('message', {
    //             user: 'Admin',
    //             text: `${userId} has joined the room`,
    //         });
    //     });

});

// app.post('/send-message', (req, res) => {
//     const { room, userId, text } = req.body;
//     io.in(room).emit('message', {
//         user: userId,
//         text: text,
//     });
//     io.emit('receiveMessage', text);
//     console.log(`User ${userId} sent message: ${text}`);
//     res.status(200).json({ message: 'Message sent successfully' });
// });

const PORT = 5000

socketServer.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
