import express from 'express';
import authRoutes from './routes/auth.route.js';
import userRoutes from './routes/user.route.js';

const app = express();
app.use(express.json());

// Mount authentication and user management routes under /api.
app.use('/api', authRoutes);
app.use('/api', userRoutes);

// Handle unmatched routes with a JSON 404 response.
app.use((req, res) => {
    res.status(404).json({ message: 'Route not found' });
});

// Global error handler for unexpected errors.
app.use((err, req, res, next) => {
    console.error('Unhandled application error:', err);
    res.status(500).json({ message: 'Internal server error' });
});

export default app;
