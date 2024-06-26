import { Injectable } from '@nestjs/common';
import { contract } from '@repo/contract';
import { and, asc, count, desc, eq, getTableColumns, ilike } from 'drizzle-orm';
import {
  DrizzleService,
  schema,
} from '@/shared/database/drizzle/drizzle.service';
import { InsertSystemLoginLog } from '@repo/drizzle';
import { ServerInferRequest } from '@ts-rest/core';

@Injectable()
export class MonitorService {
  constructor(private readonly drizzle: DrizzleService) {}

  get schema() {
    return schema.systemLoginLog;
  }

  get query() {
    return this.db.query.systemLoginLog;
  }

  get columnFields() {
    return getTableColumns(this.schema);
  }

  get db() {
    return this.drizzle.db;
  }

  async create(dto: InsertSystemLoginLog) {
    return this.db.insert(this.schema).values(dto).returning(this.columnFields);
  }

  getAll() {
    return this.query.findMany();
  }

  getOne(id: number) {
    return this.db
      .select(this.columnFields)
      .from(this.schema)
      .where(eq(this.schema.id, id));
  }

  update(id: number, dto: Partial<InsertSystemLoginLog>) {
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

  /** 筛选所有部门 */
  async onlineFilterAll(
    queryParams: ServerInferRequest<
      typeof contract.monitorOnline.filterAll
    >['query'],
  ) {
    const query = {
      orderBy: 'asc',
      pageNum: 1,
      pageSize: 10,
      ...queryParams,
    };
    const whereOptions = and(
      query.username
        ? ilike(this.schema.username, `%${query.username}%`)
        : undefined,
    );
    const orderByOptions = () => {
      if (query.orderBy === 'asc') {
        return [asc(this.schema.id)];
      } else if (query.orderBy === 'desc') {
        return [desc(this.schema.id)];
      }
    };
    const [users, total] = await Promise.all([
      this.query.findMany({
        where: whereOptions,
        limit: query.pageSize,
        offset: (query.pageNum - 1) * query.pageSize,
        ...(query.orderBy ? { orderBy: orderByOptions() } : {}),
        // TODO: 原始查询
        // orderBy: sql`${this.schema[query.sortBy]} ${sql.raw(query.orderBy)} nulls first`,
      }),
      this.db
        .select({ count: count(this.schema.id) })
        .from(this.schema)
        .where(whereOptions),
    ]);
    return { list: users, total: total[0].count };
  }
}
