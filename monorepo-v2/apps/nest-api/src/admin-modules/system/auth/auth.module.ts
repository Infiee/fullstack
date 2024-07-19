import { Module } from '@nestjs/common';
import { SystemAuthService } from './auth.service';
import { SystemAuthController } from './auth.controller';
import { SystemUserModule } from '../user/user.module';

@Module({
  imports: [SystemUserModule],
  controllers: [SystemAuthController],
  providers: [SystemAuthService],
})
export class SystemAuthModule {}
