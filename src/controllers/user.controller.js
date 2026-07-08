import mongoose from 'mongoose';
import User from '../models/user.model.js';

// Common helper that handles invalid MongoDB ObjectId errors.
function handleCastError(error, res) {

    if (error instanceof mongoose.Error.CastError) {
        return res.status(400).json({ message: 'Invalid user ID format' });
    }

    return false;
}

function authorizeSelfRequest(req, res) {
    if (req.user._id.toString() !== req.params.id) {
        return res.status(403).json({ message: 'Forbidden: you can only access your own user record' });
    }
    return true;
}

// Return the current authenticated user's profile.
//GET api/profile
export async function getProfile(req, res) {
    try {
        // req.user is attached by the authentication middleware.
        return res.json(req.user);
    } catch (error) {
        console.error('Profile error:', error);
        return res.status(500).json({ message: 'Unable to load profile' });
    }
}

// Return a list of all user records without their password fields.
// GET /api/users
export async function getUsers(req, res) {
    try {
        // Find every user and exclude the password field from the response.
        const users = await User.find().select('-password');
        return res.json(users);
    } catch (error) {
        console.error('Get users error:', error);
        return res.status(500).json({ message: 'Unable to fetch users' });
    }
}

// Return a single user by ID, excluding the password field.
// GET /api/users/:id
export async function getUserById(req, res) {
    try {
        if (!authorizeSelfRequest(req, res)) return;
        // Look up the user by the ID supplied in the request URL.
        const user = await User.findById(req.params.id).select('-password');
        if (!user) {
            // If no user is found, return a 404 Not Found.
            return res.status(404).json({ message: 'User not found' });
        }
        return res.json(user);
    } catch (error) {
        // If the ID format is invalid, the helper sends a 400 response.
        if (handleCastError(error, res)) return;
        console.error('Get user by ID error:', error);
        return res.status(500).json({ message: 'Unable to fetch user' });
    }
}

// Update only the user's name.
// PUT /api/users/:id
export async function updateUser(req, res) {

    const { name } = req.body;
    // Validate that name exists and is a string.
    if (!name || typeof name !== 'string') {
        return res.status(400).json({ message: 'Name is required and must be a string' });
    }

    try {
        if (!authorizeSelfRequest(req, res)) return;
        // Update the user document and return the updated version.
        const user = await User.findByIdAndUpdate(
            req.params.id,
            { name: name.trim() },
            { new: true, runValidators: true, select: '-password' }
        );

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        return res.json(user);
    } catch (error) {
        if (handleCastError(error, res)) return;
        console.error('Update user error:', error);
        return res.status(500).json({ message: 'Unable to update user' });
    }
}

// Delete a user by their ID.
// DELETE /api/users/:id
export async function deleteUser(req, res) {
    try {
        if (!authorizeSelfRequest(req, res)) return;
        // Remove the user document matching the requested ID.
        const user = await User.findByIdAndDelete(req.params.id);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        return res.json({ message: 'User deleted successfully' });
    } catch (error) {
        if (handleCastError(error, res)) return;
        console.error('Delete user error:', error);
        return res.status(500).json({ message: 'Unable to delete user' });
    }
}
