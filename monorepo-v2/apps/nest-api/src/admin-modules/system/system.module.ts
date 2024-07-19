import { Module } from '@nestjs/common';
import { SystemUserModule } from './user/user.module';
import { SystemAuthModule } from './auth/auth.module';
import { SystemMenuModule } from './menu/menu.module';

@Module({
  imports: [SystemUserModule, SystemAuthModule, SystemMenuModule],
  controllers: [],
  providers: [],
})
export class SystemModule {}
