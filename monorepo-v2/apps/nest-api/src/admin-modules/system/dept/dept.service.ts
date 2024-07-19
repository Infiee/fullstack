import { Inject, Injectable } from '@nestjs/common';
import { contract, InsertSystemDept } from '@repo/shared';
import { and, asc, desc, eq, getTableColumns, ilike } from 'drizzle-orm';
import { DB_CLIENT, DrizzleDB, schemas } from '@/shared/drizzle/drizzle.module';
import { ServerInferRequest } from '@ts-rest/core';
import { isNumber } from 'radash';

@Injectable()
export class SystemDeptService {
  constructor(@Inject(DB_CLIENT) private readonly db: DrizzleDB) {}

  get schema() {
    return schemas.systemDept;
  }

  get columnFields() {
    return getTableColumns(this.schema);
  }

  async create(dto: InsertSystemDept) {
    return this.db.insert(this.schema).values(dto).returning(this.columnFields);
  }

  getAll() {
    return this.db.query.systemDept.findMany();
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
    const depts = await this.db.query.systemDept.findMany({
      where: whereOptions,
      ...(query.orderBy ? { orderBy: orderByOptions() } : {}),
    });
    return depts;
  }
}
