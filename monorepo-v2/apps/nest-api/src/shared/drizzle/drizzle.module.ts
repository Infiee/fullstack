import { Global, Module } from '@nestjs/common';
import { drizzle, NodePgDatabase } from 'drizzle-orm/node-postgres';
import { Pool } from 'pg';
import { schemas } from '@repo/drizzle';
import { AppConfigService } from '@/config/app-config.service';

export const DB_CLIENT = Symbol('DB_CLIENT');
export type DrizzleDB = NodePgDatabase<typeof schemas>;
export { schemas };

@Global()
@Module({
  imports: [],
  providers: [
    {
      inject: [AppConfigService],
      provide: DB_CLIENT,
      useFactory: async (config: AppConfigService) => {
        const connectionString = config.get('DB_PG_URL');
        const pool = new Pool({ connectionString });
        return drizzle(pool, { schema: schemas, logger: true });
      },
    },
  ],
  exports: [DB_CLIENT],
})
export class DrizzleModule {}
