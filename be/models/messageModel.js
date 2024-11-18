const mongoose = require('mongoose')

const messageSchema = new mongoose.Schema({
    sender: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'users',
        required: true,
    },
    chatId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'chats',
        required: true,
    },
    content: {
        type: String,
        required: true,
    },
    read: {
        type: Boolean,
        default: false,
    },
}, {
    timestamps: true,
    versionKey: false
});

module.exports = mongoose.model('messages', messageSchema);