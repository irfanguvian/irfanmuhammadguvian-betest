const mongoose = require('mongoose');

const authTokenSchema = new mongoose.Schema({
  accessId: {
    type: String,
    required: true,
    unique: true
  },
  userId: {
    type: String,
    required: true
  }
}, { timestamps: true });

const AuthToken = mongoose.model('AuthToken', authTokenSchema);

module.exports = AuthToken;
