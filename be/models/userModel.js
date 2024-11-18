// user model including:
/*
- name,
  email,
  password,
  profilePicture,
  defaultProfilePicture,
  isAdmin,
  { timestaps: true },
*/
const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    profilePicture: { type: String, required: false },
    isAdmin: { type: Boolean, default: false },
}, {
    timestamps: true,
    collection: 'users',
    versionKey: false
}
);

module.exports = mongoose.model('users', userSchema);