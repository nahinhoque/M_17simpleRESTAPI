import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import User from '../models/user.model.js';

const { JWT_SECRET } = process.env;
// Define how many salt rounds bcrypt should use.
const SALT_ROUNDS = 10;

if (!JWT_SECRET) {
    throw new Error('JWT_SECRET is required in .env');
}

// Task3: Register a new user with encrypted password storage.
// POST api/register
export async function register(req, res) {
    // Read the expected registration fields from the request body.
    const { name, email, password } = req.body;

    // Validate that all required fields were provided.
    if (!name || !email || !password) {
        return res.status(400).json({ message: 'Name, email and password are required' });
    }

    // Check if the email is already registered.
    const existingUser = await User.findOne({ email });
    if (existingUser) {
        return res.status(409).json({ message: 'Email already registered' });
    }

    // Hash the plain-text password.
    const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS);
    // Create and save the user record in the database.
    const user = await User.create({ name, email, password: hashedPassword });

    // Send back a success response with the new user's ID.
    res.status(201).json({ message: 'Registration successful', userId: user._id });
}

// Task4: Authenticate a user email and password and return a JWT token.
// POST api/login
export async function login(req, res) {
    try {
        // Read the login credentials from the request body.
        const { email, password } = req.body;

        // Validate that email and password are both present.
        if (!email || !password) {
            return res.status(400).json({ message: 'Email and password are required' });
        }

        // Find a user record matching the supplied email.
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }

        // Compare the provided password with the stored hash.
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }

        // Create a signed JWT token containing the user's id and email.
        const token = jwt.sign(
            { id: user._id, email: user.email },
            JWT_SECRET,
            { expiresIn: '1d' }
        );

        // Return the token and user profile on successful login.
        res.status(200).json({
            message: 'Login successful',
            token,
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
            },
        });
    } catch (error) {
        // Log unexpected errors and return a 500 response.
        console.error('Login error:', error);
        res.status(500).json({ message: 'Server error during login' });
    }
}
