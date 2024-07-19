import { Module } from '@nestjs/common';
import { SystemDeptService } from './dept.service';
import { SystemDeptController } from './dept.controller';
import { SystemUserModule } from '../user/user.module';

@Module({
  imports: [SystemUserModule],
  controllers: [SystemDeptController],
  providers: [SystemDeptService],
})
export class DeptModule {}
