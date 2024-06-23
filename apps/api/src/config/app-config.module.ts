import { Global, Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { envConfigSchema } from './configuration';
import { AppConfigService } from './app-config.service';

@Global()
@Module({
  imports: [
    /**
     * TODO: 如果是自定义了AppConfigModule引入ConfigModule模块，isGlobal:true 表示ConfigModule只在AppConfigModule内全局共享，
     * 所以这里需要用@Global装饰器，把AppConfigModule变为全局模块，这样才会全局生效
     */
    ConfigModule.forRoot({
      isGlobal: true,
      cache: true,
      // 自定义验证
      validate: (env) => envConfigSchema.parse(env),
      // envFilePath: [`.env.${process.env.NODE_ENV}`],
      envFilePath: ['.env', '.env.local'],
    }),
  ],
  providers: [AppConfigService],
  exports: [AppConfigService],
})
export class AppConfigModule {}
