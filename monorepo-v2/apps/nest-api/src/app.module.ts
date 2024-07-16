import { Module } from '@nestjs/common';
import { SharedModule } from './shared/shared.module';
import { AdminModule } from './admin-modules/admin.module';

@Module({
  imports: [SharedModule, AdminModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
