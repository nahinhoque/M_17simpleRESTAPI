import { Router } from 'express';
import { authenticate } from '../middleware/auth.js';
import {
    getProfile,
    getUsers,
    getUserById,
    updateUser,
    deleteUser,
} from '../controllers/user.controller.js';

const router = Router();

// Protected route: returns the currently authenticated user's profile.
// GET /api/users/profile
router.get('/profile', authenticate, getProfile);

// Protected route: returns all users (passwords are excluded in controller).
// GET /api/users
router.get('/users', authenticate, getUsers);

// Protected route: returns a single user by their ID.
// GET /api/users/:id
router.get('/users/:id', authenticate, getUserById);

// Protected route: updates only the user's name.
// PUT /api/users/:id
router.put('/users/:id', authenticate, updateUser);

// Protected route: deletes the user with the given ID.
// DELETE /api/users/:id
router.delete('/users/:id', authenticate, deleteUser);

export default router;
