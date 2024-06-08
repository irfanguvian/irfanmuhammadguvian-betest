const express = require('express');
const AuthController = require('../controllers/authController');

const router = express.Router();

router.post('/generate-token', AuthController.generateToken);
router.post('/verify-token', AuthController.verifyToken);

module.exports = router;
