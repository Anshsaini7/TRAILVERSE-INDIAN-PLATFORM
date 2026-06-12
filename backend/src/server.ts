import dotenv from 'dotenv';
// Load environment variables early
dotenv.config();

import app from './app';
import { connectDB } from './config/db';
import { connectRedis } from './config/redis';

const PORT = process.env.PORT || 5000;

async function startServer() {
  // Connect to DB and Cache
  await connectDB();
  await connectRedis();

  const server = app.listen(PORT, () => {
    console.log(`🚀 TrailVerse API Server running in ${process.env.NODE_ENV || 'development'} mode on port ${PORT}`);
  });

  // Handle Unhandled Rejections (e.g. unhandled database exceptions)
  process.on('unhandledRejection', (err: any) => {
    console.error('⨯ Unhandled Rejection:', err.message || err);
    // Gracefully shut down server
    server.close(() => {
      process.exit(1);
    });
  });

  // Handle SIGTERM (Docker container stop trigger)
  process.on('SIGTERM', () => {
    console.log('⚠ SIGTERM received. Gracefully shutting down...');
    server.close(() => {
      console.log('Process terminated.');
      process.exit(0);
    });
  });
}

// Handle Uncaught Exceptions
process.on('uncaughtException', (err) => {
  console.error('⨯ Uncaught Exception:', err);
  process.exit(1);
});

startServer();
