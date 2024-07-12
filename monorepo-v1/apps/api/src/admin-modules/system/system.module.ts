import { Module } from '@nestjs/common';
import { SystemService } from './system.service';
import { SystemController } from './system.controller';
import { UserModule } from './user/user.module';
import { RoleModule } from './role/role.module';
import { AuthModule } from './auth/auth.module';
import { LogModule } from './log/log.module';
import { MenuModule } from './menu/menu.module';
import { DeptModule } from './dept/dept.module';

@Module({
  controllers: [SystemController],
  providers: [SystemService],
  imports: [
    UserModule,
    RoleModule,
    AuthModule,
    LogModule,
    MenuModule,
    DeptModule,
  ],
})
export class SystemModule {}
