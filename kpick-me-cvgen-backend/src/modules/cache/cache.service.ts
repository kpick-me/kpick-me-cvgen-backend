import { Injectable, OnModuleInit, OnModuleDestroy, Logger } from '@nestjs/common';
import Redis from 'ioredis';
import * as crypto from 'crypto';

export interface CachedResponse {
  content: string;
  metadata: any;
  cachedAt: Date;
}

@Injectable()
export class CacheService implements OnModuleInit, OnModuleDestroy {
  private readonly logger = new Logger(CacheService.name);
  private redisClient: Redis;
  private isConnected = false;

  private readonly CACHE_TTL = 3600;
  private readonly CACHE_PREFIX = 'cv:generation:';

  async onModuleInit() {
    if (!process.env.REDIS_URL) {
      this.logger.warn('REDIS_URL not configured, caching disabled');
      this.isConnected = false;
      return;
    }

    try {
      const redisUrl = process.env.REDIS_URL || 'redis://localhost:6379';
      this.logger.log(`Connecting to Redis at ${redisUrl}...`);

      const redisOptions: any = {
        retryStrategy: (times) => {
          if (times > 3) {
            this.logger.warn('Max Redis retry attempts reached, caching disabled');
            return undefined;
          }
          const delay = Math.min(times * 50, 2000);
          return delay;
        },
        maxRetriesPerRequest: 3,
        enableOfflineQueue: false,
      };

      if (redisUrl.includes('upstash.io') || redisUrl.startsWith('rediss://')) {
        redisOptions.tls = {
          rejectUnauthorized: true,
        };
      }

      this.redisClient = new Redis(redisUrl, redisOptions);

      this.redisClient.on('connect', () => {
        this.isConnected = true;
        this.logger.log('Redis connected successfully');
      });

      this.redisClient.on('error', (err) => {
        this.logger.error('Redis connection error:', err.message);
        this.isConnected = false;
      });

      this.redisClient.on('ready', () => {
        this.isConnected = true;
        this.logger.log('Redis client ready');
      });

    } catch (error) {
      this.logger.error('Failed to initialize Redis:', error.message);
      this.isConnected = false;
    }
  }

  async onModuleDestroy() {
    if (this.redisClient) {
      await this.redisClient.quit();
      this.logger.log('Redis connection closed');
    }
  }

  private generateCacheKey(data: any, userId: string): string {
    const dataStr = JSON.stringify(data);
    const hash = crypto
      .createHash('md5')
      .update(`${dataStr}:${userId}`)
      .digest('hex');
    return `${this.CACHE_PREFIX}${hash}`;
  }

  async getCachedResponse(data: any, userId: string): Promise<CachedResponse | null> {
    if (!this.isConnected) {
      this.logger.warn('Redis not connected, skipping cache lookup');
      return null;
    }

    try {
      const cacheKey = this.generateCacheKey(data, userId);
      const cached = await this.redisClient.get(cacheKey);

      if (cached) {
        this.logger.log(`Cache HIT for user: ${userId}`);
        return JSON.parse(cached);
      }

      this.logger.log(`Cache MISS for user: ${userId}`);
      return null;
    } catch (error) {
      this.logger.error('Error getting cached response:', error);
      return null;
    }
  }

  async cacheResponse(
    data: any,
    userId: string,
    response: { content: string; metadata: any }
  ): Promise<void> {
    if (!this.isConnected) {
      this.logger.warn('Redis not connected, skipping cache write');
      return;
    }

    try {
      const cacheKey = this.generateCacheKey(data, userId);
      const cachedData: CachedResponse = {
        ...response,
        cachedAt: new Date(),
      };

      await this.redisClient.setex(
        cacheKey,
        this.CACHE_TTL,
        JSON.stringify(cachedData)
      );

      this.logger.log(`Cached response for user: ${userId}`);
    } catch (error) {
      this.logger.error('Error caching response:', error);
    }
  }

  async clearUserCache(userId: string): Promise<void> {
    if (!this.isConnected) {
      return;
    }

    try {
      const keys = await this.redisClient.keys(`${this.CACHE_PREFIX}*${userId}*`);
      if (keys.length > 0) {
        await this.redisClient.del(...keys);
      }
      this.logger.log(`Cleared cache for user: ${userId}`);
    } catch (error) {
      this.logger.error('Error clearing cache:', error);
    }
  }

  isRedisConnected(): boolean {
    return this.isConnected;
  }
}

