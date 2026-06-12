import { createClient } from 'redis';

const redisUrl = process.env.REDIS_URL || 'redis://localhost:6379';

const redisClient = createClient({
  url: redisUrl,
});

redisClient.on('error', (err) => {
  console.error('❌ Redis Client Error:', err);
});

redisClient.on('connect', () => {
  console.log('⚡ Redis connected successfully');
});

export async function connectRedis() {
  try {
    await redisClient.connect();
  } catch (error) {
    console.error('❌ Redis connection failed. Running without cache:', error);
  }
}

export default redisClient;
