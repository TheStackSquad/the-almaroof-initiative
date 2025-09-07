//src/middleware/rate/signupRateLimit.js

// In-memory store for rate limiting (use Redis in production)
const memoryStore = new Map();

export async function rateLimit(key, maxAttempts, timeWindowSeconds) {
  const now = Date.now();
  const windowMs = timeWindowSeconds * 1000;
  
  // Get or create the client's rate limit data
  const clientData = memoryStore.get(key) || { count: 0, resetTime: now + windowMs };
  
  // Check if the time window has expired
  if (now > clientData.resetTime) {
    // Reset the counter for a new time window
    clientData.count = 1;
    clientData.resetTime = now + windowMs;
    memoryStore.set(key, clientData);
    
    return {
      success: true,
      limit: maxAttempts,
      remaining: maxAttempts - 1,
      retryAfter: 0
    };
  }
  
  // Increment the counter if within the time window
  clientData.count += 1;
  memoryStore.set(key, clientData);
  
  const remaining = Math.max(0, maxAttempts - clientData.count);
  const retryAfter = Math.ceil((clientData.resetTime - now) / 1000);
  
  // Check if the client has exceeded the limit
  if (clientData.count > maxAttempts) {
    return {
      success: false,
      limit: maxAttempts,
      remaining,
      retryAfter
    };
  }
  
  return {
    success: true,
    limit: maxAttempts,
    remaining,
    retryAfter: 0
  };
}

// Optional: Clean up expired keys periodically (every hour)
setInterval(() => {
  const now = Date.now();
  for (const [key, data] of memoryStore.entries()) {
    if (now > data.resetTime) {
      memoryStore.delete(key);
    }
  }
}, 60 * 60 * 1000); // Clean up every hour

// PRODUCTION VERSION WITH REDIS (uncomment and configure if you have Redis)
/*
import { createClient } from 'redis';

let redisClient;

// Initialize Redis client
(async () => {
  redisClient = createClient({
    url: process.env.REDIS_URL || 'redis://localhost:6379'
  });
  
  redisClient.on('error', (err) => console.error('Redis Client Error', err));
  await redisClient.connect();
})();

export async function rateLimit(key, maxAttempts, timeWindowSeconds) {
  try {
    const now = Date.now();
    const windowMs = timeWindowSeconds * 1000;
    
    // Use Redis multi/exec for atomic operations
    const multi = redisClient.multi();
    
    // Get current count and set expiration if key is new
    multi.get(key);
    multi.pttl(key);
    multi.incr(key);
    
    const results = await multi.exec();
    const currentCount = parseInt(results[0] || 0);
    const ttl = results[1];
    
    // If key is new or expired, reset the counter
    if (ttl === -2 || ttl === -1) { // -2: key doesn't exist, -1: no expiration set
      await redisClient
        .multi()
        .set(key, 1)
        .pexpire(key, windowMs)
        .exec();
      
      return {
        success: true,
        limit: maxAttempts,
        remaining: maxAttempts - 1,
        retryAfter: 0
      };
    }
    
    const remaining = Math.max(0, maxAttempts - currentCount - 1);
    const retryAfter = Math.ceil(ttl / 1000);
    
    if (currentCount >= maxAttempts) {
      return {
        success: false,
        limit: maxAttempts,
        remaining,
        retryAfter
      };
    }
    
    return {
      success: true,
      limit: maxAttempts,
      remaining,
      retryAfter: 0
    };
    
  } catch (error) {
    console.error('Rate limit error:', error);
    // Fail open - allow the request if Redis fails
    return {
      success: true,
      limit: maxAttempts,
      remaining: maxAttempts - 1,
      retryAfter: 0
    };
  }
}
*/
