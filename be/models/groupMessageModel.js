/*
group message mongoose model:
const mongoose = require('mongoose');

const groupMessageSchema = new mongoose.Schema({
  group_id: { type: mongoose.Schema.Types.ObjectId, required: true },
  sender_id: { type: mongoose.Schema.Types.ObjectId, required: true },
  message: { type: String, required: true },
  timestamp: { type: Date, default: Date.now },
});
*/