const AuthController = require('../controllers/authController');
const UserService = require('../services/userService');
const AuthService = require('../services/authService');

jest.mock('../services/userService');
jest.mock('../services/authService');

describe('AuthController', () => {
  describe('generateToken', () => {
    it('should generate a token successfully', async () => {
      const req = { body: { identityNumber: '123', emailAddress: 'test@example.com' } };
      const res = { json: jest.fn(), status: jest.fn().mockReturnThis() };
      UserService.checkUserByParam.mockResolvedValue({ _id: 'userId' });
      AuthService.generateToken.mockReturnValue('token');
      AuthService.createAuthToken.mockResolvedValue(true);

      await AuthController.generateToken(req, res);

      expect(res.json).toHaveBeenCalledWith(expect.objectContaining({ success: true }));
    });

    it('should return an error if identityNumber or emailAddress is missing', async () => {
      const req = { body: {} }; // Missing identityNumber and emailAddress
      const res = { json: jest.fn(), status: jest.fn().mockReturnThis() };

      await AuthController.generateToken(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
    });

    it('should return an error if user not found', async () => {
      const req = { body: { identityNumber: '123', emailAddress: 'test@example.com' } };
      const res = { json: jest.fn(), status: jest.fn().mockReturnThis() };
      UserService.checkUserByParam.mockResolvedValue(null);

      await AuthController.generateToken(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
    });
  });

  describe('verifyToken', () => {
    it('should verify a token successfully', async () => {
      const req = { body: { userToken: 'token' } };
      const res = { json: jest.fn(), status: jest.fn().mockReturnThis() };
      AuthService.verifyToken.mockReturnValue({ accessId: 'accessId', userId: 'userId' });
      AuthService.findByAccessId.mockResolvedValue(true);

      await AuthController.verifyToken(req, res);

      expect(res.json).toHaveBeenCalledWith(expect.objectContaining({ success: true }));
    });

    it('should return an error if token verification fails', async () => {
      const req = { body: { userToken: 'invalidToken' } };
      const res = { json: jest.fn(), status: jest.fn().mockReturnThis() };
      AuthService.verifyToken.mockImplementation(() => {
        throw new Error('Failed to verify token');
      });

      await AuthController.verifyToken(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
    });
  });
});