const jwt = require('jsonwebtoken');
jest.mock('jsonwebtoken');
const AuthToken = require('../models/authToken');
const AuthService = require('./authService');
const mockingoose = require('mockingoose');

const mockAuthModel = jest.fn();

describe('AuthService', () => {
  describe('generateToken', () => {
    it('should generate a token with user data and expire in 1 hour', () => {
      const userData = { accessId: '123', userId: '456' };
      jwt.sign.mockImplementation(() => 'mockToken');
      const token = AuthService.generateToken(userData);
      expect(jwt.sign).toHaveBeenCalledWith(
        { accessId: userData.accessId, userId: userData.userId },
        process.env.JWT_SECRET,
        { expiresIn: '1H' }
      );
      expect(token).toBe('mockToken');
    });
  });

  describe('createAuthToken', () => { 
    it('should delete the latest token and save a new one for the user', async () => { 
      const mockUserData = { userId: '123', accessId: 'abc' };

      mockingoose(AuthToken).toReturn(mockUserData, 'create');
      const result = await AuthService.createAuthToken(mockUserData);

      expect(result.accessId).toBe(mockUserData.accessId);
      expect(result.userId).toBe(mockUserData.userId);
    }); 
  });

  describe('findByAccessId', () => {
    it('should find a token by accessId', async () => {
      const mockUserData = { accessId: 'abc' };

      mockingoose(AuthToken).toReturn(mockUserData, 'findOne');
      const result = await AuthService.findByAccessId(mockUserData);

      expect(result.accessId).toBe(mockUserData.accessId);
    });

    it('should not find a token by accessId', async () => {
      const mockUserData = { accessId: 'abc' };

      mockingoose(AuthToken).toReturn(null, 'findOne');
      const result = await AuthService.findByAccessId(mockUserData);

      expect(result).toBe(null);
    });
  });

  describe('verifyToken', () => {
    it('should verify a token and return the decoded user data', () => {
      const token = 'validToken';
      const decodedPayload = { accessId: '123', userId: '456' };
      jwt.verify.mockReturnValue(decodedPayload);

      const result = AuthService.verifyToken(token);
      expect(jwt.verify).toHaveBeenCalledWith(token, process.env.JWT_SECRET);
      expect(result).toEqual(decodedPayload);
    });
  });
});