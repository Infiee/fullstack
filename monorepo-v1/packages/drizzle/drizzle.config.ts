import type { Config } from 'drizzle-kit';
import { DB_PG_URL } from 'kit/db';

export default {
  schema: './src/schema/*.schema.ts',
  out: './migration',
  dialect: 'postgresql',
  dbCredentials: {
    url: DB_PG_URL,
  },
  // strict: true,
  verbose: true,
} satisfies Config;
