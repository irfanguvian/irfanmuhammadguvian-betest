const userService = require('./userService');
const jwt = require('jsonwebtoken');
const axios = require('axios');
jest.mock('axios');
jest.mock('jsonwebtoken');

describe('userService', () => {
  describe('checkUserByParam', () => {
    it('should return user data if user exists', async () => {
      const userData = { identityNumber: '67890', emailAddress: 'john@example.com' };
      const response = { data: { success: true, data: userData } };
      axios.get.mockResolvedValue(response);
      const result = await userService.checkUserByParam(userData);
      expect(result).toBe(response.data.data);
    });

    it('should return null if user does not exist', async () => {
      const userData = { identityNumber: '00000', emailAddress: 'john@example.com' };
      const response = { data: { success: false } };
      axios.get.mockResolvedValue(response);
      const result = await userService.checkUserByParam(userData);
      expect(result).toBeNull();
    });

    it('should throw an error if the request fails', async () => {
      const userData = { identityNumber: '67890', emailAddress: 'john@example.com' };
      const error = { response: { data: { message: 'Request failed' } } };
      axios.get.mockRejectedValue(error);
      await expect(userService.checkUserByParam(userData)).rejects.toThrow('Request failed');
    });
  });

  describe('generateToken', () => {
    it('should return a valid JWT token', () => {
      const userData = { id: '12345' };
      const token = 'valid.token';
      jwt.sign.mockReturnValue(token);
      const result = userService.generateToken(userData);
      expect(result).toBe(token);
    });
  });

  describe('verifyToken', () => {
    it('should verify a valid JWT token', () => {
      const token = 'valid.token';
      jwt.verify.mockReturnValue(true);
      const result = userService.verifyToken(token);
      expect(result).toBe(true);
    });

    it('should throw an error for an invalid JWT token', () => {
      const token = 'invalid.token';
      jwt.verify.mockImplementation(() => { throw new Error('Invalid token'); });
      expect(() => userService.verifyToken(token)).toThrow('Invalid token');
    });
  });
});