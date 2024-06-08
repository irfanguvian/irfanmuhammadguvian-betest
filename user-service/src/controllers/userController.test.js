const UserController = require('../controllers/userController');
const UserService = require('../services/userService');
const connection = require("../index.js");

jest.mock('../services/userService');
jest.mock("../index.js", () => ({
  redisClient: {
    get: jest.fn(),
    set: jest.fn(),
    del: jest.fn(),
  },
}));

describe('UserController', () => {
  let req, res, next;

  beforeEach(() => {
    req = { body: {}, params: {} };
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn().mockReturnThis(),
    };
    next = jest.fn();
  });

  describe('createUser', () => {
    it('should create a user and return 201 status', async () => {
      UserService.createUser.mockResolvedValue({ id: 1, name: 'John Doe' });
      req.body = { name: 'John Doe' };

      await UserController.createUser(req, res);

      expect(UserService.createUser).toHaveBeenCalledWith(req.body);
      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith({
        success: true,
        message: 'User created',
      });
    });

    it('should return 400 status if there is an error', async () => {
      const errorMessage = 'Error creating user';
      UserService.createUser.mockRejectedValue(new Error(errorMessage));
      req.body = { name: 'John Doe' };

      await UserController.createUser(req, res);

      expect(UserService.createUser).toHaveBeenCalledWith(req.body);
      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({
        success: false,
        message: errorMessage,
      });
    });
  });

  describe('updateUser', () => {
    it('should update a user and return 200 status', async () => {
      UserService.getUserById.mockResolvedValue({ id: 1, name: 'John Doe' });
      UserService.updateUser.mockResolvedValue({ id: 1, name: 'John Doe updated' });
      
      req.body = { id: 1, name: 'John Doe updated' };

      await UserController.updateUser(req, res);

      expect(UserService.getUserById).toHaveBeenCalledWith(req.body.id);
      expect(UserService.updateUser).toHaveBeenCalledWith(req.body);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        success: true,
        message: 'User updated',
      });
    });

    it('should return 404 if user is not found', async () => {
      UserService.getUserById.mockResolvedValue(null);
      req.body = { id: 1, name: 'John Doe' };

      await UserController.updateUser(req, res);

      expect(UserService.getUserById).toHaveBeenCalledWith(req.body.id);
      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({
        success: false,
        message: 'User not found',
      });
    });

    it('should return 400 status if there is an error', async () => {
      const errorMessage = 'Error updating user';
      UserService.getUserById.mockResolvedValue({ id: 1, name: 'John Doe' });
      UserService.updateUser.mockRejectedValue(new Error(errorMessage));
      req.body = { id: 1, name: 'John Doe' };

      await UserController.updateUser(req, res);

      expect(UserService.getUserById).toHaveBeenCalledWith(req.body.id);
      expect(UserService.updateUser).toHaveBeenCalledWith(req.body);
      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({
        success: false,
        message: errorMessage,
      });
    });
  });

  describe('deleteUser', () => {
    it('should delete a user and return 200 status', async () => {
      UserService.getUserById.mockResolvedValue({ id: 1, name: 'John Doe' });
      UserService.deleteUser.mockResolvedValue({ id: 1, name: 'John Doe' });
      
      req.body = { id: 1 };

      await UserController.deleteUser(req, res);

      expect(UserService.getUserById).toHaveBeenCalledWith(req.body.id);
      expect(UserService.deleteUser).toHaveBeenCalledWith(req.body);
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        success: true,
        message: 'User deleted',
      });
    });

    it('should return 404 if user is not found', async () => {
      UserService.getUserById.mockResolvedValue(null);
      req.body = { id: 1 };

      await UserController.deleteUser(req, res);

      expect(UserService.getUserById).toHaveBeenCalledWith(req.body.id);
      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({
        success: false,
        message: 'User not found',
      });
    });

    it('should return 400 status if there is an error', async () => {
      const errorMessage = 'Error deleting user';
      UserService.getUserById.mockResolvedValue({ id: 1, name: 'John Doe' });
      UserService.deleteUser.mockRejectedValue(new Error(errorMessage));
      req.body = { id: 1 };

      await UserController.deleteUser(req, res);

      expect(UserService.getUserById).toHaveBeenCalledWith(req.body.id);
      expect(UserService.deleteUser).toHaveBeenCalledWith(req.body);
      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({
        success: false,
        message: errorMessage,
      });
    });
  });

  describe('getUserByAccountNumber', () => {
    it('should return user from cache if exists', async () => {
      const cachedUser = { id: 1, name: 'John Doe' };
      connection.redisClient.get.mockResolvedValue(JSON.stringify(cachedUser));
      req.params.accountNumber = '12345';

      await UserController.getUserByAccountNumber(req, res);

      expect(connection.redisClient.get).toHaveBeenCalledWith('12345');
      expect(res.json).toHaveBeenCalledWith({
        success: true,
        message: 'User found',
        data: cachedUser,
      });
    });

    it('should return user from database if not in cache', async () => {
      const user = { id: 1, name: 'John Doe' };
      connection.redisClient.get.mockResolvedValue(null);
      UserService.getUserByAccountNumber.mockResolvedValue(user);
      req.params.accountNumber = '12345';

      await UserController.getUserByAccountNumber(req, res);

      expect(connection.redisClient.get).toHaveBeenCalledWith('12345');
      expect(UserService.getUserByAccountNumber).toHaveBeenCalledWith('12345');
      expect(res.json).toHaveBeenCalledWith({
        success: true,
        message: 'User found',
        data: user,
      });
    });

    it('should return 404 if user is not found in database', async () => {
      connection.redisClient.get.mockResolvedValue(null);
      UserService.getUserByAccountNumber.mockResolvedValue(null);
      req.params.accountNumber = '12345';

      await UserController.getUserByAccountNumber(req, res);

      expect(connection.redisClient.get).toHaveBeenCalledWith('12345');
      expect(UserService.getUserByAccountNumber).toHaveBeenCalledWith('12345');
      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({ message: 'User not found' });
    });

    it('should return 400 status if there is an error', async () => {
      const errorMessage = 'Error fetching user';
      connection.redisClient.get.mockRejectedValue(new Error(errorMessage));
      req.params.accountNumber = '12345';

      await UserController.getUserByAccountNumber(req, res);

      expect(connection.redisClient.get).toHaveBeenCalledWith('12345');
      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({
        success: false,
        message: errorMessage,
        data: null
      });
    });
  });

  describe('getUserByIdentityNumber', () => {
    it('should return user from cache if exists', async () => {
      const cachedUser = JSON.stringify({ id: 1, name: 'John Doe' });
      connection.redisClient.get.mockResolvedValue(cachedUser);
      req.params.identityNumber = '98765';

      await UserController.getUserByIdentityNumber(req, res);

      expect(connection.redisClient.get).toHaveBeenCalledWith('98765');
      expect(res.json).toHaveBeenCalledWith({
        success: true,
        message: 'User found',
        data: JSON.parse(cachedUser),
      });
    });

    it('should return user from database if not in cache', async () => {
      const user = { id: 1, name: 'John Doe' };
      connection.redisClient.get.mockResolvedValue(null);
      UserService.getUserByIdentityNumber.mockResolvedValue(user);
      req.params.identityNumber = '98765';

      await UserController.getUserByIdentityNumber(req, res);

      expect(connection.redisClient.get).toHaveBeenCalledWith('98765');
      expect(UserService.getUserByIdentityNumber).toHaveBeenCalledWith('98765');
      expect(res.json).toHaveBeenCalledWith({
        success: true,
        message: 'User found',
        data: user,
      });
    });

    it('should return 404 if user is not found in database', async () => {
      connection.redisClient.get.mockResolvedValue(null);
      UserService.getUserByIdentityNumber.mockResolvedValue(null);
      req.params.identityNumber = '98765';

      await UserController.getUserByIdentityNumber(req, res);

      expect(connection.redisClient.get).toHaveBeenCalledWith('98765');
      expect(UserService.getUserByIdentityNumber).toHaveBeenCalledWith('98765');
      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({
        success: false,
        message: 'User not found',
        data: null
      });
    });

    it('should return 400 status if there is an error', async () => {
      const errorMessage = 'Error fetching user';
      connection.redisClient.get.mockRejectedValue(new Error(errorMessage));
      req.params.identityNumber = '98765';

      await UserController.getUserByIdentityNumber(req, res);

      expect(connection.redisClient.get).toHaveBeenCalledWith('98765');
      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({
        success: false,
        message: errorMessage,
        data: null
      });
    });
  });

  describe('getUserByIdentityNumberAndEmail', () => {
    it('should return user from cache if exists', async () => {
      const cachedUser = JSON.stringify({ id: 1, name: 'John Doe' });
      connection.redisClient.get.mockResolvedValue(cachedUser);
      req.body = { emailAddress: 'john@example.com', identityNumber: '98765' };

      await UserController.getUserByIdentityNumberAndEmail(req, res);

      expect(connection.redisClient.get).toHaveBeenCalledWith('john@example.com#98765');
      expect(res.json).toHaveBeenCalledWith({
        success: true,
        message: 'User found',
        data: JSON.parse(cachedUser),
      });
    });

    it('should return user from database if not in cache', async () => {
      const user = { id: 1, name: 'John Doe' };
      connection.redisClient.get.mockResolvedValue(null);
      UserService.getUserByIdentityNumberAndEmail.mockResolvedValue(user);
      req.body = { emailAddress: 'john@example.com', identityNumber: '98765' };

      await UserController.getUserByIdentityNumberAndEmail(req, res);

      expect(connection.redisClient.get).toHaveBeenCalledWith('john@example.com#98765');
      expect(UserService.getUserByIdentityNumberAndEmail).toHaveBeenCalledWith('98765', 'john@example.com');
      expect(res.json).toHaveBeenCalledWith({
        success: true,
        message: 'User found',
        data: user,
      });
    });

    it('should return 404 if user is not found in database', async () => {
      connection.redisClient.get.mockResolvedValue(null);
      UserService.getUserByIdentityNumberAndEmail.mockResolvedValue(null);
      req.body = { emailAddress: 'john@example.com', identityNumber: '98765' };

      await UserController.getUserByIdentityNumberAndEmail(req, res);

      expect(connection.redisClient.get).toHaveBeenCalledWith('john@example.com#98765');
      expect(UserService.getUserByIdentityNumberAndEmail).toHaveBeenCalledWith('98765', 'john@example.com');
      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({
        success: false,
        message: 'User not found',
        data: null
      });
    });

    it('should return 400 status if there is an error', async () => {
      const errorMessage = 'Error fetching user';
      connection.redisClient.get.mockRejectedValue(new Error(errorMessage));
      req.body = { emailAddress: 'john@example.com', identityNumber: '98765' };

      await UserController.getUserByIdentityNumberAndEmail(req, res);

      expect(connection.redisClient.get).toHaveBeenCalledWith('john@example.com#98765');
      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({
        success: false,
        message: errorMessage,
        data: null
      });
    });
  });
});
