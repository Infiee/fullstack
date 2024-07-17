import { Inject, Injectable } from '@nestjs/common';
import { ServerInferRequest } from '@ts-rest/core';
import { isNumber } from 'radash';
import {
  and,
  asc,
  count,
  desc,
  eq,
  getTableColumns,
  ilike,
  inArray,
} from 'drizzle-orm';
import { InsertSysUser, SelectSysUser } from '@repo/drizzle';
import { contract } from '@repo/contract';
import { hashPassword } from '@/common/utils/password';
import { DrizzleDB, DB_CLIENT, schemas } from '@/shared/drizzle/drizzle.module';

@Injectable()
export class UserService {
  constructor(@Inject(DB_CLIENT) private readonly db: DrizzleDB) {}

  protected get schema() {
    return schemas.sysUser;
  }

  protected get query() {
    return this.db.query.sysUser;
  }

  protected get columnFields() {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { password, ...fields } = getTableColumns(this.schema);
    return fields;
  }

  async create(dto: InsertSysUser) {
    dto.password = await hashPassword(dto.password);
    return this.db.insert(this.schema).values(dto).returning(this.columnFields);
  }

  async filterAll(
    queryParams: ServerInferRequest<typeof contract.sysUser.filterAll>['query'],
  ) {
    const query = {
      pageNum: 1,
      pageSize: 10,
      sortBy: 'id',
      orderBy: '',
      ...queryParams,
    };
    const whereOptions = and(
      query.username
        ? ilike(this.schema.username, `%${query.username}%`)
        : undefined,
      query.phone ? ilike(this.schema.phone, `%${query.phone}%`) : undefined,
      isNumber(query.status) ? eq(this.schema.status, query.status) : undefined,
      query.deptId ? eq(this.schema.deptId, query.deptId) : undefined,
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
        columns: { password: false },
        where: whereOptions,
        with: {
          dept: {
            columns: {
              id: true,
              name: true,
            },
          },
        },
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

  async findById(id: number) {
    return await this.db
      .select(this.columnFields)
      .from(this.schema)
      .where(eq(this.schema.id, id));
  }

  async findOne(
    key: keyof Omit<SelectSysUser, 'password'>,
    value: string | number,
  ): Promise<SelectSysUser[]> {
    return this.db
      .select()
      .from(this.schema)
      .where(eq(this.schema[key], value));
  }

  async update(id: number, dto: Partial<Omit<SelectSysUser, 'password'>>) {
    return await this.db
      .update(this.schema)
      .set(dto)
      .where(eq(this.schema.id, id))
      .returning(this.columnFields);
  }

  async remove(id: number) {
    return await this.db
      .delete(this.schema)
      .where(eq(this.schema.id, id))
      .returning(this.columnFields);
  }

  async assignRole(userId: number, roleIds: number[]) {
    const relations = roleIds.map((roleId) => ({ roleId, userId }));
    await this.db.transaction(async (tx) => {
      await tx
        .delete(schemas.sysUserToRole)
        .where(eq(schemas.sysUserToRole.userId, userId));

      if (relations.length > 0) {
        await tx.insert(schemas.sysUserToRole).values(relations).returning();
      }
    });
  }

  async resetPassword(id: number, dto: Pick<InsertSysUser, 'password'>) {
    dto.password = await hashPassword(dto.password);
    return await this.db
      .update(this.schema)
      .set(dto)
      .where(eq(this.schema.id, id))
      .returning(this.columnFields);
  }

  async getRoleIds(userId: number) {
    const relations = await this.db.query.sysUserToRole.findMany({
      where: eq(schemas.sysUserToRole.userId, userId),
    });
    return relations.map((i) => i.roleId);
  }

  async getRoles(userId: number) {
    const relations = await this.db.query.sysUserToRole.findMany({
      where: eq(schemas.sysUserToRole.userId, userId),
      columns: {},
      with: {
        sysRole: {
          columns: {
            code: true,
          },
        },
      },
    });
    return relations.map((i) => i.sysRole.code);
  }

  batchRemove(ids: number[]) {
    return this.db.delete(this.schema).where(inArray(this.schema.id, ids));
  }
}
