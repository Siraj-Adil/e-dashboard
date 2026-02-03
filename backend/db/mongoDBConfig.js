import mongoose from 'mongoose';
import dotenv from 'dotenv';
dotenv.config();

export default async function connectDB() {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('MongoDB Atlas connected successfully!');
    } catch (err) {
        console.error('MongoDB connection failed:', err.message);
    }
}
