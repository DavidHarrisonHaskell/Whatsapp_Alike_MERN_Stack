/*
message mongoose model:

const mongoose = require('mongoose');

const MessageSchema = new mongoose.Schema({
  sender: {
   type: mongoose.Schema.Types.ObjectId,
   ref: 'User',
   required: true,
  },
  chat: {
   type: mongoose.Schema.Types.ObjectId,
   ref: 'Chat',
   required: true,
  },
  content: {
   type: String,
   required: true,
  },
  readBy: [
   type: mongoose.Schema.Types.ObjectId,
   ref: 'User',
  ],
},
 { timestamps: true });
*/