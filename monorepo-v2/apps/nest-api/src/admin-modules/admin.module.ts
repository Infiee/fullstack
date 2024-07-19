import { Module } from '@nestjs/common';
import { SystemModule } from './system/system.module';

@Module({
  imports: [SystemModule],
  controllers: [],
})
export class AdminModule {}
