import { Global, Module } from '@nestjs/common';
import { DrizzleService } from './drizzle.service';
import { DrizzleModule } from './drizzle.module';

@Global()
@Module({
  imports: [DrizzleModule],
  providers: [DrizzleService],
  exports: [DrizzleService],
})
export class DatabaseModule {}
