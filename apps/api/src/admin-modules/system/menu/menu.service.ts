import { Injectable } from '@nestjs/common';
import { eq, getTableColumns, sql } from 'drizzle-orm';
import {
  DrizzleService,
  schema,
} from '@/shared/database/drizzle/drizzle.service';
import { InsertSystemMenu } from '@repo/drizzle';

@Injectable()
export class MenuService {
  constructor(private readonly drizzle: DrizzleService) {}

  get schema() {
    return schema.systemMenu;
  }

  get query() {
    return this.db.query.systemMenu;
  }

  get columnFields() {
    return getTableColumns(this.schema);
  }

  get db() {
    return this.drizzle.db;
  }

  async create(dto: InsertSystemMenu) {
    return this.db.insert(this.schema).values(dto).returning(this.columnFields);
  }

  getAll() {
    return this.db.query.systemMenu.findMany({
      offset: 0,
      // orderBy: [asc(this.schema.parentId), asc(this.schema.rank)],
      orderBy: sql`${this.schema.parentId} asc nulls first,${this.schema.rank} asc`,
    });
  }

  getOne(id: number) {
    return this.db
      .select(this.columnFields)
      .from(this.schema)
      .where(eq(this.schema.id, id));
  }

  update(id: number, dto: Partial<InsertSystemMenu>) {
    return this.db
      .update(this.schema)
      .set(dto)
      .where(eq(this.schema.id, id))
      .returning(this.columnFields);
  }

  remove(id: number) {
    return this.db
      .delete(this.schema)
      .where(eq(this.schema.id, id))
      .returning(this.columnFields);
  }
}
