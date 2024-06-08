const express = require('express');
const UserController = require('../controllers/userController');
const authMiddleware = require('../middlewares/authMiddleware');

const router = express.Router();

router.post('/',UserController.createUser);
router.post('/update',authMiddleware,UserController.updateUser);
router.post('/delete',authMiddleware,UserController.deleteUser);
router.get('/accountNumber/:accountNumber',authMiddleware,UserController.getUserByAccountNumber);
router.get('/identityNumber/:identityNumber',authMiddleware,UserController.getUserByIdentityNumber);
router.get('/check-identity',UserController.getUserByIdentityNumberAndEmail);


module.exports = router;
