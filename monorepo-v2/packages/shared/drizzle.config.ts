import type { Config } from 'drizzle-kit';
import { DB_PG_URL } from './seed/db';

export default {
  schema: './src/drizzle/schema/**/*.schema.ts',
  out: './migration',
  dialect: 'postgresql',
  dbCredentials: {
    url: DB_PG_URL,
  },
  // strict: true,
  verbose: true,
} satisfies Config;
