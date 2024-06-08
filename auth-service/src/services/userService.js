const jwt = require('jsonwebtoken');
const axios = require('axios');
const dotenv = require('dotenv');

dotenv.config();

class AuthService {
  static async checkUserByParam(userData) {
    try {
      const getUser = await axios.get(`${process.env.USER_SERVICE_URL}/users/check-identity`, {
        data: {
          identityNumber: userData.identityNumber,
          emailAddress: userData.emailAddress
        }
      })
  
      if(getUser.data.success == false) {
        return null
      }
  
      return getUser.data.data;
    } catch (error) {
      if(error.response && error.response.data) {
        throw new Error(error.response.data.message);
      }
      throw new Error(error.message);
    }
  }

  static generateToken(userData) {

    return jwt.sign(
      { id: userData.id },
      process.env.JWT_SECRET,
      { expiresIn: '1h' }
      );
  }

  static verifyToken(token) {
    return jwt.verify(token, process.env.JWT_SECRET);
  }
}

module.exports = AuthService;
