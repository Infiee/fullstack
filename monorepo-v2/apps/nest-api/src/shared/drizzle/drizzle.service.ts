import { Inject, Injectable } from '@nestjs/common';
import { NodePgDatabase } from 'drizzle-orm/node-postgres';
import { PG_CONNECTION } from './drizzle.module';
import * as schemas from '@repo/drizzle';

export { schemas };

@Injectable()
export class DrizzleService {
  constructor(
    @Inject(PG_CONNECTION)
    protected readonly database: NodePgDatabase<typeof schemas>,
  ) {}

  /** 获取原始db */
  get db() {
    return this.database;
  }
}
