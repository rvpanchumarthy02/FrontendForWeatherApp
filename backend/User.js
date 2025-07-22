const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  name: String,
  email: {
    type: String,
    required: true,
    unique: true
  },
  password: String,
  location: String,
  unit: String,
  createdAt: {
    type: Date,
    default: Date.now
  },
});

module.exports = mongoose.model('User', UserSchema);

