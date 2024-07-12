import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { SysModule } from './modules/sys/sys.module';

@Module({
  imports: [SysModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
