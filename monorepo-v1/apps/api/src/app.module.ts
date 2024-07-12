import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AdminModule } from './admin-modules/admin.module';
import { SharedModule } from './shared/shared.module';

@Module({
  imports: [SharedModule, AdminModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
