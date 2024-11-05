/*
group model mongoose model:

const mongoose = require('mongoose');

const groupSchema = new mongoose.Schema({
  name: { type: String, required: true },
  members: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  last_message: {
  type: mongoose.Schema.Types.ObjectId,
  ref: 'GroupMessage',
 },
},
{ timestamps: true });
*/