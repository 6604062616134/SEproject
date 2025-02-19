const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const { authenticateToken } = require('../middleware/authenticateToken');

// ใช้ Middleware กับฟังก์ชัน getUserById
router.get('/:id', authenticateToken, userController.getUserById);

// CRUD routes
router.get('', userController.getAllUsers);
router.get('/:id', userController.getUserById);

router.post('/register', userController.createUser);
router.post('/login', userController.login);
router.post('/logout', userController.logout);

router.put('/update/:id', userController.updateUser);
router.delete('/:id', userController.deleteUser);

module.exports = router;