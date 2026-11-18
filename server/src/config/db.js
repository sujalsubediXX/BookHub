import mongoose from 'mongoose';

const RETRY_DELAY_MS = 5000;

export default async function connectDB() {
  mongoose.set('strictQuery', true);

  if (!process.env.MONGO_URI) {
    throw new Error('MONGO_URI is not configured in server/.env');
  }

  while (true) {
    try {
      await mongoose.connect(process.env.MONGO_URI, { serverSelectionTimeoutMS: RETRY_DELAY_MS });
      console.log('MongoDB connected');
      return;
    } catch (error) {
      console.error(`MongoDB connection failed: ${error.message}`);
      console.error(`Retrying in ${RETRY_DELAY_MS / 1000}s...`);
      await new Promise((resolve) => setTimeout(resolve, RETRY_DELAY_MS));
    }
  }
}
