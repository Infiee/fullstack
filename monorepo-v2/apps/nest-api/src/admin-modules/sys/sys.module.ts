import { Module } from '@nestjs/common';
import { SysUserModule } from './sys-user/user.module';

@Module({
  imports: [SysUserModule],
  controllers: [],
  providers: [],
})
export class SysModule {}
