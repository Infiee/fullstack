import { Inject, Injectable } from '@nestjs/common';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { RedisCache } from 'cache-manager-ioredis-yet';
import Redis, { Cluster } from 'ioredis';
import ms from 'ms';

const getVal = (value: any) => JSON.stringify(value) || '"undefined"';

@Injectable()
export class RedisCacheService {
  constructor(@Inject(CACHE_MANAGER) private cacheManager: RedisCache) {}

  get client(): Redis | Cluster {
    return this.cacheManager.store.client;
  }

  async get<T>(key: string) {
    const val = await this.client.get(key);
    // return JSON.parse(val as string) as T;
    if (val === undefined || val === null) {
      return undefined;
    } else {
      return JSON.parse(val) as T;
    }
  }

  /** ttl: 毫秒 */
  set(key: string, value: any, ttl?: number) {
    if (ttl) {
      return this.client.set(key, getVal(value), 'PX', ttl);
    } else {
      return this.client.set(key, getVal(value));
    }
  }

  del(key: string) {
    return this.client.del(key);
  }

  reset() {
    return this.client.reset();
  }

  /** TODO: 设置持久化存储为1d，防止长期不登录一直占用空间 */
  persistSet(key: string, value: any) {
    // return this.client.set(key, value);
    return this.set(key, value, ms('1d'));
  }

  async cleanUserCache(userId: number | string) {
    const keys = await this.getKeys(`*:${userId}`);
    await this.client.del(keys);
  }

  /** 阻塞的方式获取keys */
  getKeys(pattern: string): Promise<string[]> {
    return this.client.keys(pattern);
  }

  /**
   * 以scan的方式获取redis内的keys,非阻塞
   * @param pattern 如: *:${user.id}
   * @param count 如: 100
   * @returns Promise<string[]>
   */
  getScanKeys(pattern: string, count = 1000): Promise<string[]> {
    return new Promise((resolve, reject) => {
      const keys: string[] = [];
      const scanRecursive = (cursor: string) => {
        this.client.scan(
          cursor,
          'MATCH',
          pattern,
          'COUNT',
          count,
          (err, reply) => {
            if (err) {
              reject(err);
              return;
            }
            if (!reply) return;
            const [newCursor, currentKeys] = reply;
            keys.push(...currentKeys);
            if (newCursor === '0') {
              resolve(keys);
            } else {
              scanRecursive(newCursor);
            }
          },
        );
      };
      scanRecursive('0');
    });
  }
}
