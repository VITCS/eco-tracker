import mongoose from 'mongoose';

export const connectDB = async (uri: string) => {
  if (!uri) throw new Error('MONGO_URI is required');
  await mongoose.connect(uri);
  mongoose.connection.on('connected', () => console.log('MongoDB connected'));
  mongoose.connection.on('error', (err) => console.error('MongoDB error', err));
};

