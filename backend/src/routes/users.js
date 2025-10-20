const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');

// GET /users - Fetch all users
router.get('/', userController.getAllUsers);

// PUT /users/:id - Update user information
router.put('/:id', userController.updateUser);

module.exports = router;