import { Router } from 'express';
import { register, login } from '../controllers/auth.controller.js';

const router = Router();

// Public route for creating a new user account.
router.post('/register', register);

// Public route for authenticating a user and returning a JWT token.
router.post('/login', login);

export default router;
