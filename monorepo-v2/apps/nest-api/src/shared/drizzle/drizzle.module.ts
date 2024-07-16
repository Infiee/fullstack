import { Global, Module } from '@nestjs/common';
import { drizzle } from 'drizzle-orm/node-postgres';
import { Pool } from 'pg';
import * as schema from '@repo/drizzle';
import { AppConfigService } from '@/config/app-config.service';

export const PG_CONNECTION = 'PG_CONNECTION';

@Global()
@Module({
  imports: [],
  providers: [
    {
      inject: [AppConfigService],
      provide: PG_CONNECTION,
      // inject: [],
      useFactory: async (config: AppConfigService) => {
        const connectionString = config.get('DB_PG_URL');

        // const pool = postgres(connectionString);
        // return drizzle(pool, { schema: schema, logger: true });

        const pool = new Pool({ connectionString });
        return drizzle(pool, { schema: schema, logger: true });
      },
    },
  ],
  exports: [PG_CONNECTION],
})
export class DrizzleModule {}
