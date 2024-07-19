import { Module } from '@nestjs/common';
import { SystemRoleService } from './role.service';
import { SystemRoleController } from './role.controller';
import { SystemUserModule } from '../user/user.module';

@Module({
  imports: [SystemUserModule],
  controllers: [SystemRoleController],
  providers: [SystemRoleService],
})
export class RoleModule {}
