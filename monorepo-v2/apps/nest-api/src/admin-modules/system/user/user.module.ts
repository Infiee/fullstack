import { Module } from '@nestjs/common';
import { SystemUserService } from './user.service';
import { SystemUserController } from './user.controller';

@Module({
  controllers: [SystemUserController],
  providers: [SystemUserService],
  exports: [SystemUserService],
})
export class SystemUserModule {}
