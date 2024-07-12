import { Module } from '@nestjs/common';
import { SysUserModule } from './sys-user/sys-user.module';

@Module({
  imports: [SysUserModule],
})
export class SysModule {}
