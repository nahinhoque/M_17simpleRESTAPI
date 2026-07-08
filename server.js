// Load environment variables from the .env file before any other modules execute.
import 'dotenv/config';
import app from './src/app.js';
import { connectDB } from './src/config/db.js';

// Define the port the server will listen on.
const port = process.env.PORT || 5000;

async function startServer() {
    try {
        await connectDB();

        app.listen(port, () => {
            console.log(`Server listening on port ${port}`);
        });
    } catch (error) {
        console.error('Failed to start server:', error);
        process.exit(1);
    }
}

startServer();
