import dotenv from 'dotenv';
import { connectDB } from './config/db';
import { env } from './config/env';
import app from './app';

dotenv.config();

const start = async () => {
  // Temporarily disable MongoDB connection for demo
  // await connectDB(env.MONGO_URI);
  console.log('Starting API without MongoDB (demo mode)');
  app.listen(env.PORT, () => {
    console.log(`API listening on http://localhost:${env.PORT}`);
  });
};

start().catch((err) => {
  console.error('Failed to start server', err);
  process.exit(1);
});

