import { Module } from '@nestjs/common';
import { SystemModule } from '@/admin-modules/system/system.module';

@Module({
  imports: [SystemModule],
  controllers: [],
})
export class AdminModule {}
