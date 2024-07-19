import { Module } from '@nestjs/common';
import { SystemUserModule } from './user/user.module';
import { SystemAuthModule } from './auth/auth.module';
import { SystemMenuModule } from './menu/menu.module';
import { SystemRoleModule } from './role/role.module';
import { SystemDeptModule } from './dept/dept.module';

@Module({
  imports: [
    SystemUserModule,
    SystemAuthModule,
    SystemMenuModule,
    SystemRoleModule,
    SystemDeptModule,
  ],
  controllers: [],
  providers: [],
})
export class SystemModule {}
