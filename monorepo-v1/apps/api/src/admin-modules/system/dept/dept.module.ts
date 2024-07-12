import { Module } from '@nestjs/common';
import { DeptService } from './dept.service';
import { DeptController } from './dept.controller';
import { UserModule } from '../user/user.module';

@Module({
  imports: [UserModule],
  controllers: [DeptController],
  providers: [DeptService],
})
export class DeptModule {}
