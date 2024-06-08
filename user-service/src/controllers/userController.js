const UserService = require('../services/userService');
const connection = require("../index.js")

class UserController {
  static async createUser(req, res) {
    const result = {
      success: false,
      message: 'Error create Uuer',
    }

    try {
      const user = await UserService.createUser(req.body);
      result.success = true;
      result.message = 'User created';

      return res.status(201).json(result);
    } catch (error) {
      result.message = error.message;
      return res.status(400).json(result);
    }
  }

  static async getUserByAccountNumber(req, res) {
    const result = {
      success: false,
      message: 'Error get user',
      data: null
    }

    try {
      const userValueCache = await connection.redisClient.get(`${req.params.accountNumber}`);
      if(userValueCache) {
        result.success = true
        result.message = 'User found';
        result.data = JSON.parse(userValueCache)
        return res.json(result);
      }

      const user = await UserService.getUserByAccountNumber(req.params.accountNumber);
      if (!user) {
        result.message = 'User not found';
        return res.status(404).json({ message: 'User not found' });
      }
      await connection.redisClient.set(`${req.params.accountNumber}`, JSON.stringify(user), {EX: 60 * 5});
      result.success = true
      result.message = 'User found';
      result.data = user
      return res.json(result);
    } catch (error) {
      result.message = error.message;
      return res.status(400).json(result);
    }
  }

  static async updateUser(req, res) {
    const result = {
      success: false,
      message: 'Error update user',
    }

    try {
      const checkUser = await UserService.getUserById(req.body.id)
      if(!checkUser) {
        result.message = 'User not found';
        return res.status(404).json(result);
      }
      const deleteKey = await connection.redisClient.del(
        [`${checkUser.accountNumber}`,`${checkUser.identityNumber}`,`${checkUser.emailAddress}#${checkUser.identityNumber}`]
      );

      const user = await UserService.updateUser(req.body);

      result.success = true
      result.message = 'User updated';
      return res.status(200).json(result);

    } catch (error) {
      result.message = error.message;
      return res.status(400).json(result);
    }
  }

  static async deleteUser(req, res) {
    const result = {
      success: false,
      message: 'Error delete user',
    }

    try {
      const checkUser = await UserService.getUserById(req.body.id)
      if(!checkUser) {
        result.message = 'User not found';
        return res.status(404).json(result);
      }

      const deleteKey = await connection.redisClient.del(
        [`${checkUser.accountNumber}`,`${checkUser.identityNumber}`,`${checkUser.emailAddress}#${checkUser.identityNumber}`]
      );

      const user = await UserService.deleteUser(req.body);

      result.success = true
      result.message = 'User deleted';
      return res.status(200).json(result);
    } catch (error) {
      result.message = error.message;
      return res.status(400).json(result);
    }
  }

  static async getUserByIdentityNumber(req, res) {
    const result = {
      success: false,
      message: 'Error get user',
      data: null
    }

    try {
      const userValueCache = await connection.redisClient.get(`${req.params.identityNumber}`);
      if(userValueCache) {
        result.success = true
        result.message = 'User found';
        result.data = JSON.parse(userValueCache)
        return res.json(result);
      }

      const user = await UserService.getUserByIdentityNumber(req.params.identityNumber);
      if (!user) {
        result.message = 'User not found';

        return res.status(404).json(result);
      }
      await connection.redisClient.set(`${req.params.identityNumber}`, JSON.stringify(user), {EX: 60 * 5});
      result.success = true
      result.message = 'User found';
      result.data = user
      return res.json(result);

    } catch (error) {
      result.message = error.message;
      return res.status(400).json(result);
    }
  }

  static async getUserByIdentityNumberAndEmail(req, res) {
    const result = {
      success: false,
      message: 'Error get user',
      data: null
    }
    try {
      
      const userValueCache = await connection.redisClient.get(`${req.body.emailAddress}#${req.body.identityNumber}`);
      
      if(userValueCache) {
        result.success = true
        result.message = 'User found';
        result.data = JSON.parse(userValueCache)
        return res.json(result);
      }

      const user = await UserService.getUserByIdentityNumberAndEmail(req.body.identityNumber, req.body.emailAddress);
      if (!user) {
        result.message = 'User not found';

        return res.status(404).json(result);
      }
      await connection.redisClient.set(`${req.body.emailAddress}#${req.body.identityNumber}`, JSON.stringify(user), {EX: 60 * 5});
      result.success = true
      result.message = 'User found';
      result.data = user
      return res.json(result);
    } catch (error) {
      result.message = error.message;
      return res.status(400).json(result);
    }
  }
}

module.exports = UserController;
