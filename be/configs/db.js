const mongoose = require('mongoose');

mongoose.connect('mongodb://127.0.0.1:27017/MessengerApplication')
.then(() => console.log('Connected to MongoDB'))
.catch(err => console.error('MongoDB connection error:', err));