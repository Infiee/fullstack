// import { Client } from 'pg';
import pg from "pg";
import { drizzle } from "drizzle-orm/node-postgres";
import * as schema from "../src";

export const DB_PG_URL = "postgresql://postgres:root@localhost:5432/test";

const { Client } = pg

export async function getDb() {
  const client = new Client({
    connectionString: DB_PG_URL,
  });
  await client.connect();
  const db = drizzle(client, { schema });
  return { db, client };
}
