import { Injectable } from '@nestjs/common';
import { contract } from '@repo/contract';
import { and, asc, desc, eq, getTableColumns, ilike } from 'drizzle-orm';
import {
  DrizzleService,
  schema,
} from '@/shared/database/drizzle/drizzle.service';
import { InsertSystemDept } from '@repo/drizzle';
import { ServerInferRequest } from '@ts-rest/core';
import { isNumber } from 'radash';

@Injectable()
export class DeptService {
  constructor(private readonly drizzle: DrizzleService) {}

  get schema() {
    return schema.systemDept;
  }

  get query() {
    return this.db.query.systemDept;
  }

  get columnFields() {
    return getTableColumns(this.schema);
  }

  get db() {
    return this.drizzle.db;
  }

  async create(dto: InsertSystemDept) {
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

  update(id: number, dto: Partial<InsertSystemDept>) {
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
  async filterAll(
    queryParams: ServerInferRequest<
      typeof contract.systemDept.filterAll
    >['query'],
  ) {
    const query = {
      orderBy: 'asc',
      ...queryParams,
    };
    const whereOptions = and(
      query.name ? ilike(this.schema.name, `%${query.name}%`) : undefined,
      isNumber(query.status) ? eq(this.schema.status, query.status) : undefined,
    );
    const orderByOptions = () => {
      if (query.orderBy === 'asc') {
        return [asc(this.schema.parentId), asc(this.schema.sort)];
      } else if (query.orderBy === 'desc') {
        return [desc(this.schema.parentId), desc(this.schema.sort)];
      }
    };
    const depts = await this.query.findMany({
      where: whereOptions,
      ...(query.orderBy ? { orderBy: orderByOptions() } : {}),
    });
    return depts;
  }
}
