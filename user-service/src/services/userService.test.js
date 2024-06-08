const UserService = require('./userService');
const User = require('../models/userModel');

jest.mock('../models/userModel')

describe('UserService', () => {
  describe('createUser', () => {
    it('should create a new user', async () => {
      User.prototype.save = jest.fn().mockResolvedValue(true);

      const userData = { accountNumber: '12345', identityNumber: '67890', userName: 'John Doe', emailAddress: 'john@example.com' };
      User.create.mockResolvedValue(userData);
      const user = await UserService.createUser(userData);

      expect(user).toBe(userData);
    });
  });

  describe('getUserByAccountNumber', () => {
    it('should return user by account number', async () => {
      const user = { accountNumber: '12345', identityNumber: '67890', userName: 'John Doe', emailAddress: 'john@example.com' };
      User.findOne.mockResolvedValue(user);

      const result = await UserService.getUserByAccountNumber('12345');

      expect(User.findOne).toHaveBeenCalledWith({ accountNumber: '12345' });
      expect(result).toBe(user);
    });

    it('should return null if user not found', async () => {
      User.findOne.mockResolvedValue(null);

      const result = await UserService.getUserByAccountNumber('99999');

      expect(User.findOne).toHaveBeenCalledWith({ accountNumber: '99999' });
      expect(result).toBeNull();
    });
  });

  describe('getUserByIdentityNumber', () => {
    it('should return user by identity number', async () => {
      const user = { accountNumber: '12345', identityNumber: '67890', userName: 'John Doe', emailAddress: 'john@example.com' };
      User.findOne.mockResolvedValue(user);

      const result = await UserService.getUserByIdentityNumber('67890');

      expect(User.findOne).toHaveBeenCalledWith({ identityNumber: '67890' });
      expect(result).toBe(user);
    });

    it('should return null if user not found', async () => {
      User.findOne.mockResolvedValue(null);

      const result = await UserService.getUserByIdentityNumber('00000');

      expect(User.findOne).toHaveBeenCalledWith({ identityNumber: '00000' });
      expect(result).toBeNull();
    });
  });

  describe('getUserById', () => {
    it('should return user by id', async () => {
      const userId = "123";
      const returnVal = {id: "123"}
      User.findById.mockResolvedValue(returnVal);

      const result = await UserService.getUserById(userId);

      expect(User.findById).toHaveBeenCalledWith(userId);
      expect(result).toBe(returnVal);
      expect(result.id).toBe(userId);

    });

    it('should return null if user not found', async () => {
      User.findById.mockResolvedValue(null);

      const result = await UserService.getUserById('00000');

      expect(User.findById).toHaveBeenCalledWith("00000");
      expect(result).toBeNull();
    });
  });
});
