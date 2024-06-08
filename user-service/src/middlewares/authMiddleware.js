const dotenv = require('dotenv');
const axios = require('axios');

dotenv.config();

const authMiddleware = async (req, res, next) => {
  const token = req.header('Authorization').replace('Bearer ', '');

  if (!token) {
    return res.status(401).json({ message: 'No token, authorization denied' });
  }

  try {
    const getUser = await axios.post(`${process.env.AUTH_SERVICE_URL}/auth/verify-token`, {
      userToken: token
    })

    if(getUser.data.success == false ) {
      return res.status(401).json({ message: 'Token is not valid' });
    }
    next();
  } catch (error) {
    res.status(401).json({ message: 'Token is not valid' });
  }
};

module.exports = authMiddleware;
