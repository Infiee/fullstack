import { Injectable } from '@nestjs/common';
import {
  and,
  asc,
  count,
  desc,
  eq,
  getTableColumns,
  ilike,
  inArray,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  sql,
} from 'drizzle-orm';
import {
  DrizzleService,
  schema,
} from '@/shared/database/drizzle/drizzle.service';
import {
  InsertSystemUser,
  SelectSystemUser,
  SelectSystemUserResult,
} from '@repo/drizzle';
import { contract } from '@repo/contract';
import { ServerInferRequest } from '@ts-rest/core';
import { hashPassword } from '@/common/utils/password';
import { isNumber } from 'radash';

@Injectable()
export class UserService {
  constructor(private readonly drizzle: DrizzleService) {}

  protected get schema() {
    return schema.systemUser;
  }

  protected get query() {
    return this.db.query.systemUser;
  }

  protected get columnFields() {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { password, ...fields } = getTableColumns(this.schema);
    return fields;
  }

  protected get db() {
    return this.drizzle.db;
  }

  async create(dto: InsertSystemUser) {
    dto.password = await hashPassword(dto.password);
    return this.db.insert(this.schema).values(dto).returning(this.columnFields);
  }

  async filterAll(
    queryParams: ServerInferRequest<
      typeof contract.systemUser.filterAll
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
    key: keyof Omit<SelectSystemUser, 'password'>,
    value: string | number,
  ): Promise<SelectSystemUser[]> {
    return this.db
      .select()
      .from(this.schema)
      .where(eq(this.schema[key], value));
  }

  async update(id: number, dto: Partial<SelectSystemUserResult>) {
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
        .delete(schema.systemUserToRole)
        .where(eq(schema.systemUserToRole.userId, userId));

      if (relations.length > 0) {
        await tx.insert(schema.systemUserToRole).values(relations).returning();
      }
    });
  }

  async resetPassword(id: number, dto: Pick<InsertSystemUser, 'password'>) {
    dto.password = await hashPassword(dto.password);
    return await this.db
      .update(this.schema)
      .set(dto)
      .where(eq(this.schema.id, id))
      .returning(this.columnFields);
  }

  async getRoleIds(userId: number) {
    const relations = await this.db.query.systemUserToRole.findMany({
      where: eq(schema.systemUserToRole.userId, userId),
    });
    return relations.map((i) => i.roleId);
  }

  async getRoles(userId: number) {
    const relations = await this.db.query.systemUserToRole.findMany({
      where: eq(schema.systemUserToRole.userId, userId),
      columns: {},
      with: {
        systemRole: {
          columns: {
            code: true,
          },
        },
      },
    });
    return relations.map((i) => i.systemRole.code);
  }

  batchRemove(ids: number[]) {
    return this.db.delete(this.schema).where(inArray(this.schema.id, ids));
  }
}
