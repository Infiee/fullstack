/* eslint-disable @typescript-eslint/no-unused-vars */
import { Global, Module } from '@nestjs/common';
import { DatabaseModule } from './database/database.module';
import { APP_FILTER, APP_GUARD, APP_INTERCEPTOR } from '@nestjs/core';
import { AllExceptionsFilter } from '@/core/filter/all-exception.filter';
import { AppConfigModule } from '@/config/app-config.module';
import { CacheManageModule } from './cache/cache.module';
import { SharedService } from './shared.service';
import { AuthGuard } from '@/core/guard/auth.guard';
import { RefreshTokenInterceptor } from '@/core/interceptor/refresh-token.interceptor';

@Global()
@Module({
  imports: [AppConfigModule, DatabaseModule, CacheManageModule],
  providers: [
    // {
    //   provide: APP_GUARD,
    //   useClass: AuthGuard,
    // },
    /** 单token自动续期拦截器 */
    // {
    //   provide: APP_INTERCEPTOR,
    //   useClass: RefreshTokenInterceptor,
    // },
    {
      provide: APP_FILTER,
      useClass: AllExceptionsFilter,
    },
    SharedService,
  ],
  exports: [SharedService],
})
export class SharedModule {}
