
const mongoose = require('mongoose');

const chatSchema = new mongoose.Schema({
    participants: {
        type: [mongoose.Schema.Types.ObjectId],
        ref: 'User',
        required: true,
    },
    lastMessage: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'messages'
    },
    unreadMessagesCount: {
        type: Number,
        default: 0,
    },
}, { 
    timestamps: true,
    versionKey: false,
    collection: 'chats'
 });

module.exports = mongoose.model('chats', chatSchema);