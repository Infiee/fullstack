import { Injectable } from '@nestjs/common';
import { contract } from '@repo/rest-contract';
import { and, asc, count, desc, eq, getTableColumns, ilike } from 'drizzle-orm';
import { DrizzleService, schema } from '@/shared/database/drizzle.service';
import { InsertSystemRole } from '@repo/drizzle';
import { ServerInferRequest } from '@ts-rest/core';

@Injectable()
export class RoleService {
  constructor(private readonly drizzle: DrizzleService) {}

  get schema() {
    return schema.systemRole;
  }

  get query() {
    return this.db.query.systemRole;
  }

  get columnFields() {
    return getTableColumns(this.schema);
  }

  get db() {
    return this.drizzle.db;
  }

  async create(dto: InsertSystemRole) {
    return this.db.insert(this.schema).values(dto).returning(this.columnFields);
  }

  // getAll(query: BasePagination = { pageNum: 1, pageSize: 10 }) {
  getAll() {
    return this.query.findMany();
  }

  getOne(id: number) {
    return this.db
      .select(this.columnFields)
      .from(this.schema)
      .where(eq(this.schema.id, id));
  }

  update(id: number, dto: Partial<InsertSystemRole>) {
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

  /** 角色分配用户 */
  async assignUser(roleId: number, userIds: number[]) {
    const relations = userIds.map((userId) => ({ userId, roleId }));
    await this.db.transaction(async (tx) => {
      await tx
        .delete(schema.systemUserToRole)
        .where(eq(schema.systemUserToRole.roleId, roleId));
      if (relations.length > 0) {
        await tx.insert(schema.systemUserToRole).values(relations).returning();
      }
    });
  }

  /** 角色分配菜单 */
  async assignMenu(roleId: number, menuIds: number[]) {
    const relations = menuIds.map((menuId) => ({ menuId, roleId }));
    await this.db.transaction(async (tx) => {
      await tx
        .delete(schema.systemMenuToRole)
        .where(eq(schema.systemMenuToRole.roleId, roleId));
      if (relations.length > 0) {
        await tx.insert(schema.systemMenuToRole).values(relations).returning();
      }
    });
  }

  /** 筛选所有角色 */
  async filterAll(
    queryParams: ServerInferRequest<
      typeof contract.systemRole.filterAll
    >['query'],
  ) {
    const query = {
      pageNum: 1,
      pageSize: 10,
      sortBy: 'id',
      orderBy: '',
      ...queryParams,
    };
    const whereOptions = and(
      query.roleName
        ? ilike(this.schema.roleName, `%${query.roleName}%`)
        : undefined,
      query.roleKey
        ? ilike(this.schema.roleKey, `%${query.roleKey}%`)
        : undefined,
      query.status ? eq(this.schema.status, query.status) : undefined,
    );
    const orderByOptions = () => {
      const field = this.schema[query.sortBy];
      if (query.orderBy === 'asc') {
        return asc(field);
      } else if (query.orderBy === 'desc') {
        return desc(field);
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
        .select({
          count: count(this.schema.id),
        })
        .from(this.schema)
        .where(whereOptions),
    ]);
    return { list: users, count: total[0].count };
  }
}
