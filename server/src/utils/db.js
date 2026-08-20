import mongoose from 'mongoose';

export async function connectDB() {
  if (!process.env.MONGO_URI) {
    console.warn('MONGO_URI missing. Server will run with demo API responses.');
    return;
  }

  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('MongoDB connected');
  } catch (error) {
    console.error(`MongoDB connection failed: ${error.message}`);
    process.exit(1);
  }
}
