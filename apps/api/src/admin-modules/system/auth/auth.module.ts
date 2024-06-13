import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { UserModule } from '../user/user.module';
import { JwtModule } from '@nestjs/jwt';
import { AppConfigService } from '@/config/app-config.service';

@Module({
  imports: [
    UserModule,
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
  ],
  controllers: [AuthController],
  providers: [AuthService],
})
export class AuthModule {}
