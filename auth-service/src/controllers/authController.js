const UserService = require('../services/userService');
const AuthService = require('../services/authService');

const { v4: uuidv4 }  = require('uuid');
class AuthController {

  static async generateToken(req, res) {
    const result = {
      success: false,
      message: 'Error generated token',
      data: null
    }
    try {
      if(!req.body.identityNumber) throw new Error('identityNumber is required');
      if(!req.body.emailAddress) throw new Error('emailAddress is required');
      const checkUser = await UserService.checkUserByParam(req.body);

      if(!checkUser) throw new Error('User not found');

      const argumentCreateToken = {
        accessId: uuidv4(),
        userId: checkUser._id
      }
      
      const token = AuthService.generateToken(argumentCreateToken);
      const saveToken = await AuthService.createAuthToken(argumentCreateToken)

      result.data = {
        token: token
      }
      result.success = true
      result.message = 'Token generated';
      return res.json(result);
    } catch (error) {
      result.message = error.message;
      return res.status(400).json(result);
    }
  }

  static async verifyToken(req, res) {
    const result = {
      success: false,
      message: 'Failed to verify token',
      data: null
    }

    try {
      const decoded = AuthService.verifyToken(req.body.userToken);
      const findToken = await AuthService.findByAccessId(decoded);
      if(!findToken) {
        throw new Error("Token not found") 
      }
      
      result.data = {
        userId: decoded.userId 
      }
      result.success = true
      result.message = 'Token verified';
      return res.json(result);
    } catch (error) {
      result.message = "Failed to verify token";
      return res.status(400).json(result);
    }
  }

}

module.exports = AuthController;
