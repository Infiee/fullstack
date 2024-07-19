import { Module } from '@nestjs/common';
import { SystemMenuService } from './menu.service';
import { SystemMenuController } from './menu.controller';

@Module({
  controllers: [SystemMenuController],
  providers: [SystemMenuService],
  exports: [SystemMenuService],
})
export class SystemMenuModule {}
