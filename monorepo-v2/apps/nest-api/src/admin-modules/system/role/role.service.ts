import { Inject, Injectable } from '@nestjs/common';
import { contract, InsertSystemRole } from '@repo/shared';
import { and, asc, count, desc, eq, getTableColumns, ilike } from 'drizzle-orm';
import { DB_CLIENT, DrizzleDB, schemas } from '@/shared/drizzle/drizzle.module';
import { ServerInferRequest } from '@ts-rest/core';
import { isNumber } from 'radash';

@Injectable()
export class SystemRoleService {
  constructor(@Inject(DB_CLIENT) private readonly db: DrizzleDB) {}

  get schema() {
    return schemas.systemRole;
  }

  get columnFields() {
    return getTableColumns(this.schema);
  }

  async create(dto: InsertSystemRole) {
    return this.db.insert(this.schema).values(dto).returning(this.columnFields);
  }

  // getAll(query: BasePagination = { pageNum: 1, pageSize: 10 }) {
  getAll() {
    return this.db.query.systemRole.findMany();
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
        .delete(schemas.systemUserToRole)
        .where(eq(schemas.systemUserToRole.roleId, roleId));
      if (relations.length > 0) {
        await tx.insert(schemas.systemUserToRole).values(relations).returning();
      }
    });
  }

  /** 角色分配菜单 */
  async assignMenu(roleId: number, menuIds: number[]) {
    const relations = menuIds.map((menuId) => ({ menuId, roleId }));
    await this.db.transaction(async (tx) => {
      await tx
        .delete(schemas.systemMenuToRole)
        .where(eq(schemas.systemMenuToRole.roleId, roleId));
      if (relations.length > 0) {
        await tx.insert(schemas.systemMenuToRole).values(relations).returning();
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
      orderBy: 'asc',
      ...queryParams,
    };
    const whereOptions = and(
      query.name ? ilike(this.schema.name, `%${query.name}%`) : undefined,
      query.code ? ilike(this.schema.code, `%${query.code}%`) : undefined,
      isNumber(query.status) ? eq(this.schema.status, query.status) : undefined,
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
      this.db.query.systemRole.findMany({
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
    return { list: users, total: total[0].count };
  }

  /** 获取角色菜单 */
  async getRoleMenu(roleId: number) {
    const relations = await this.db.query.systemRole.findMany({
      where: eq(schemas.systemMenuToRole.roleId, roleId),
      columns: {},
      with: {
        systemMenuToRole: {
          columns: {},
          with: {
            systemMenu: true,
          },
        },
      },
    });
    return relations
      .map((i) => i.systemMenuToRole.map((j) => j.systemMenu))
      .flat();
  }

  /** 获取角色菜单id */
  async getRoleMenuIds(roleId: number) {
    const relations = await this.db.query.systemMenuToRole.findMany({
      where: eq(schemas.systemMenuToRole.roleId, roleId),
    });
    return relations.map((i) => i.menuId);
  }
}
