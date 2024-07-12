import { Module } from '@nestjs/common';
import { SystemModule } from '@/admin-modules/system/system.module';
import { MonitorModule } from './monitor/monitor.module';

@Module({
  imports: [SystemModule, MonitorModule],
  controllers: [],
})
export class AdminModule {}
