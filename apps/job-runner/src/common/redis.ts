import Redis from 'ioredis';
import Redlock from 'redlock';
import { randomUUID } from 'crypto';

export const redis = new Redis(process.env.REDIS_URL, {
  maxRetriesPerRequest: null,
  enableReadyCheck: false,
  connectTimeout: +process.env.LOCALTESTING ? 1000 * 1000 : undefined,
});

export const redisSubscriber = new Redis(process.env.REDIS_URL, {
  maxRetriesPerRequest: null,
  enableReadyCheck: false,
});

export const redlock = new Redlock([redis.duplicate()], {
  retryCount: 0,
});

// common

export const acquireLock = async (name: string, expirationInSecond = 0) => {
  const id = randomUUID();
  let acquire: 'OK';
  if (expirationInSecond) {
    acquire = await redis.set(name, id, 'EX', expirationInSecond, 'NX');
  } else {
    acquire = await redis.set(name, id, 'NX');
  }
  return acquire === 'OK';
};
