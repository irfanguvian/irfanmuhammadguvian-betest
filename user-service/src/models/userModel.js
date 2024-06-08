const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  accountNumber: { type: String, required: true, unique: true },
  identityNumber: { type: String, required: true, unique: true },
  userName: { type: String, required: true },
  emailAddress: { type: String, required: true, unique: true },
}, { timestamps: true });

const User = mongoose.model('User', userSchema);

module.exports = User;
