/* eslint-disable @typescript-eslint/no-unused-vars */
import { Global, Module } from '@nestjs/common';
import { APP_FILTER, APP_GUARD, APP_INTERCEPTOR } from '@nestjs/core';
// import { AllExceptionsFilter } from '@/core/filter/all-exception.filter';
import { AppConfigModule } from '@/config/app-config.module';
import { CacheManageModule } from './cache/cache.module';
import { SharedService } from './shared.service';
import { AuthGuard } from '@/core/guard/auth.guard';
import { DrizzleModule } from './drizzle/drizzle.module';
import { JwtModule } from '@nestjs/jwt';
import { AppConfigService } from '@/config/app-config.service';
import { DrizzleService } from './drizzle/drizzle.service';
// import { RefreshTokenInterceptor } from '@/core/interceptor/refresh-token.interceptor';

@Global()
@Module({
  imports: [
    JwtModule.registerAsync({
      // TODO: 暴露全局给Auth guard调用
      global: true,
      inject: [AppConfigService],
      useFactory: (config: AppConfigService) => {
        return {
          global: true,
          secret: config.get('JWT_SECRET'),
          signOptions: {
            // TODO: token设置为不过期
            // expiresIn: config.get('JWT_EXPIRESIN')
          },
        };
      },
    }),
    AppConfigModule,
    DrizzleModule,
    CacheManageModule,
  ],
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
    // {
    //   provide: APP_FILTER,
    //   useClass: AllExceptionsFilter,
    // },
    SharedService,
    DrizzleService,
  ],
  exports: [SharedService, DrizzleService],
})
export class SharedModule {}
