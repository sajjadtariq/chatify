import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

export const connect = async () => {
    try {
        // console.log("Connecting to:", process.env.MONGODB_URI); 

        const conn = await mongoose.connect(process.env.MONGODB_URI)

        console.log(`MongoDB connected: ${conn.connection.host}`);
    } catch (err) {
        console.error("MongoDB connection error:", err.message);
    }
};
