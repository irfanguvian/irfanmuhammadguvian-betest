const User = require('../models/userModel');

class UserService {
  static async createUser(userData) {
    const user = await User.create(userData);
    return user;
  }

  static async updateUser(userData) {
    const updateParam = {
      accountNumber: userData.accountNumber,
      identityNumber: userData.identityNumber,
      userName: userData.userName,
      emailAddress: userData.emailAddress,
    }
    const user = await User.findByIdAndUpdate(userData.id, updateParam, { new: true });
    return user;
  }

  static async deleteUser(userData) {
    const user = await User.findByIdAndDelete(userData.id);
    return user;
  }

  static async getUserByAccountNumber(accountNumber) {
    return User.findOne({ accountNumber });
  }

  static async getUserByIdentityNumber(identityNumber) {
    return User.findOne({ identityNumber });
  }

  static async getUserByIdentityNumberAndEmail(identityNumber, emailAddress) {
    return User.findOne({ identityNumber, emailAddress });
  }

  static async getUserById(id) {
    return User.findById(id)
  }
}

module.exports = UserService;
