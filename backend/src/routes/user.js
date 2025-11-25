const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const { protect, authorize } = require('../middleware/auth');

// All routes require authentication
router.use(protect);

// Get all users (admin only)
router.get('/', authorize('admin'), userController.getAllUsers);

// Get user by ID (admin only)
router.get('/:id', authorize('admin'), userController.getUserById);

// Create new user (admin only)
router.post('/', authorize('admin'), userController.createUser);

// Update user (admin only)
router.put('/:id', authorize('admin'), userController.updateUser);

// Delete user (admin only)
router.delete('/:id', authorize('admin'), userController.deleteUser);

// Change password (users can change their own password)
router.post('/:id/change-password', userController.changePassword);

module.exports = router;
