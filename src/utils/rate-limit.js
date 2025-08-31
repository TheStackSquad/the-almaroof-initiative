// utils/rate-limit.js
import { LRUCache } from "lru-cache";

const rateLimit = (options) => {
  const tokenCache = new LRUCache({
    max: options.uniqueTokenPerInterval || 500,
    ttl: options.interval || 60000,
  });

  return {
    check: (res, limit, token) =>
      new Promise((resolve, reject) => {
        const tokenCount = tokenCache.get(token) || 0;
        if (tokenCount >= limit) {
          reject(new Error("Rate limit exceeded"));
        } else {
          tokenCache.set(token, tokenCount + 1);
          resolve();
        }
      }),
  };
};

export default rateLimit;
