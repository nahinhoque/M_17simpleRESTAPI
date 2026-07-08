import jwt from 'jsonwebtoken';
import User from '../models/user.model.js';

// JWT secret is required for verifying the token on protected routes.
const { JWT_SECRET } = process.env;

if (!JWT_SECRET) {
    throw new Error('JWT_SECRET is required in .env');
}

// This middleware protects routes by validating the bearer token.
// It ensures that only authenticated users can access protected endpoints.
export async function authenticate(req, res, next) {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({ message: 'Authorization token missing' });
    }

    const token = authHeader.split(' ')[1];

    try {
        // Verify that the token is valid and was signed with our secret.
        const decoded = jwt.verify(token, JWT_SECRET);

        // Load the authenticated user from the database and attach to the request.
        const user = await User.findById(decoded.id).select('-password');
        if (!user) {
            return res.status(401).json({ message: 'Invalid token' });
        }

        req.user = user;
        next();
    } catch (error) {
        return res.status(401).json({ message: 'Invalid token' });
    }
}
