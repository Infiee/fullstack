import { Inject, Injectable } from '@nestjs/common';
import { NodePgDatabase } from 'drizzle-orm/node-postgres';
import { PG_CONNECTION } from './drizzle.module';
import * as schemas from '@repo/drizzle/dist/schema';

export const schema = schemas;

@Injectable()
export class DrizzleService {
  constructor(
    @Inject(PG_CONNECTION)
    protected readonly database: NodePgDatabase<typeof schemas>,
  ) {}

  get db() {
    return this.database;
  }
}
