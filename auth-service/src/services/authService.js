const jwt = require('jsonwebtoken');
const AuthToken = require('../models/authToken');

class AuthService {
  static generateToken(userData) {
    return jwt.sign(
      { accessId: userData.accessId, userId: userData.userId },
      process.env.JWT_SECRET,
      { expiresIn: '1H' }
      );
  }

  static async createAuthToken(userData) {
    const deleteLatestToken = await AuthToken.findOneAndDelete(userData.userId);
    const createToken = await AuthToken.create(userData);
    return createToken;
  }

  static async findByAccessId(userData) {
    const findAccessId = await AuthToken.findOne({accessId: userData.accessId});
    return findAccessId;
  }

  static verifyToken(token) {
    const verify = jwt.verify(token, process.env.JWT_SECRET);
    return {
      accessId: verify.accessId,
      userId: verify.userId
    }
  }
}

module.exports = AuthService;
