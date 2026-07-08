import mongoose from 'mongoose';

// Ensure the MongoDB connection string is set before attempting a connection.
if (!process.env.MONGO_URI) {
    console.error('FATAL ERROR: MONGO_URI is not defined in .env');
    process.exit(1);
}

const { MONGO_URI } = process.env;

mongoose.set('strictQuery', true);

export async function connectDB() {
    try {
        const connectionUrl = new URL(MONGO_URI);
        const dbName = connectionUrl.pathname.replace(/^\//, '') || undefined;

        await mongoose.connect(MONGO_URI, {
            dbName,
            autoIndex: false,
            serverSelectionTimeoutMS: 5000,
            socketTimeoutMS: 45000,
        });
        console.log('MongoDB connected');
    } catch (error) {
        console.error('MongoDB connection failed:', error);
        process.exit(1);
    }
}