import { Global, Module } from '@nestjs/common';
import { CacheModule } from '@nestjs/cache-manager';
import { redisStore } from 'cache-manager-ioredis-yet';
import { RedisCacheService } from './redis-cache.service';
import { AppConfigService } from '@/config/app-config.service';

// TODO: 声明为全局模块，且providers和exports导出RedisCacheService后，其它地方想使用只需要引入RedisCacheService即可（不需要再额外引入模块和providers了）
@Global()
@Module({
  imports: [
    CacheModule.registerAsync({
      imports: [],
      inject: [AppConfigService],
      /** 这里需要注意，@nestjs/cache-manager模块异步设置全局在这里，不是在Factory内 */
      isGlobal: true,
      useFactory: async (config: AppConfigService) => ({
        store: async () => {
          return redisStore({
            host: config.get('REDIS_HOST'),
            port: config.get('REDIS_PORT'),
            password: config.get('REDIS_PASSWORD'),
            ttl: config.get('REDIS_TTL'),
            db: config.get('REDIS_DB'),
          });
        },
      }),
    }),
  ],
  providers: [RedisCacheService],
  exports: [RedisCacheService],
})
export class CacheManageModule {}
