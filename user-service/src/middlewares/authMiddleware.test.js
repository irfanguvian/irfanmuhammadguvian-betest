const dotenv = require('dotenv');
const axios = require('axios');
const authMiddleware = require('./authMiddleware');

jest.mock('axios');
dotenv.config();

describe('authMiddleware', () => {
  let req, res, next;

  beforeEach(() => {
    req = {
      header: jest.fn().mockReturnValue('Bearer testToken'),
    };
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn().mockReturnThis(),
    };
    next = jest.fn();
  });

  it('should return 401 if no token is provided', async () => {
    req.header.mockReturnValueOnce('');

    await authMiddleware(req, res, next);

    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.json).toHaveBeenCalledWith({ message: 'No token, authorization denied' });
  });

  it('should call next if token is valid', async () => {
    axios.post.mockResolvedValueOnce({ data: { success: true } });

    await authMiddleware(req, res, next);

    expect(req.header).toHaveBeenCalledWith('Authorization');
    expect(axios.post).toHaveBeenCalledWith(`${process.env.AUTH_SERVICE_URL}/auth/verify-token`, { userToken: 'testToken' });
    expect(next).toHaveBeenCalled();
  });

  it('should return 401 if token is invalid', async () => {
    axios.post.mockResolvedValueOnce({ data: { success: false } });

    await authMiddleware(req, res, next);

    expect(req.header).toHaveBeenCalledWith('Authorization');
    expect(axios.post).toHaveBeenCalledWith(`${process.env.AUTH_SERVICE_URL}/auth/verify-token`, { userToken: 'testToken' });
    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.json).toHaveBeenCalledWith({ message: 'Token is not valid' });
  });

  it('should return 401 if an error occurs during token verification', async () => {
    axios.post.mockRejectedValueOnce(new Error('Verification error'));

    await authMiddleware(req, res, next);

    expect(req.header).toHaveBeenCalledWith('Authorization');
    expect(axios.post).toHaveBeenCalledWith(`${process.env.AUTH_SERVICE_URL}/auth/verify-token`, { userToken: 'testToken' });
    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.json).toHaveBeenCalledWith({ message: 'Token is not valid' });
  });
});
