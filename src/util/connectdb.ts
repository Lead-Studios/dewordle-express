// utils/connectDB.ts or db/connectDB.ts
import mongoose from 'mongoose';

const MONGODB_URI = process.env.MONGODB_URI || 'your_default_connection_string';

export const connectDB = async () => {
  try {
    if (mongoose.connection.readyState === 1) {
      await mongoose.connect(MONGODB_URI);
      console.log('MongoDB connected successfully');
    }
  } catch (error) {
    console.error('MongoDB connection error:', error);
    process.exit(1);
  }
};
