import { initContract } from "@ts-rest/core";
import { z } from "zod";
import {
  apiResultSchema,
  basePaginationAndSortSchema,
  BaseStatusSchema,
  numericString,
  RouterMetadata,
} from "../common/common";
import { insertSystemUserSchema, selectSystemUserSchema } from "@repo/drizzle";

const c = initContract();
const metadata = {
  openApiTags: ["系统-用户"],
} as RouterMetadata;

const filterUserSchema = z
  .object({
    username: z.string().optional(),
    phone: z.string().optional(),
    deptId: numericString(z.number()).optional(),
  })
  .merge(basePaginationAndSortSchema)
  .merge(BaseStatusSchema);

export const systemUser = c.router(
  {
    // 创建用户
    create: {
      method: "POST",
      path: "/user",
      body: insertSystemUserSchema,
      responses: {
        201: apiResultSchema(selectSystemUserSchema.omit({ password: true })),
      },
      metadata,
      summary: "创建系统用户",
    },
    // 筛选所有用户
    filterAll: {
      method: "GET",
      path: "/user",
      query: filterUserSchema,
      responses: {
        200: apiResultSchema(
          z.object({
            list: selectSystemUserSchema
              .omit({ password: true })
              .merge(
                z.object({
                  dept: z
                    .object({
                      id: z.number(),
                      name: z.string(),
                    })
                    .nullish(),
                })
              )
              .array(),
            total: z.number(),
          })
        ),
      },
      metadata,
      summary: "获取所有系统用户",
    },
    // 根据id获取某个系统用户
    findById: {
      method: "GET",
      path: "/user/:id",
      pathParams: z.object({ id: numericString(z.number()) }),
      responses: {
        200: apiResultSchema(selectSystemUserSchema.omit({ password: true })),
      },
      metadata,
      summary: "根据id获取某个系统用户",
    },
    // 更新某个用户
    update: {
      method: "PATCH",
      path: "/user/:id",
      pathParams: z.object({ id: numericString(z.number()) }),
      body: insertSystemUserSchema.omit({ password: true }).partial(),
      responses: {
        200: apiResultSchema(selectSystemUserSchema.omit({ password: true })),
      },
      metadata,
      summary: "更新某个系统用户",
    },
    // 删除某个用户
    remove: {
      method: "DELETE",
      path: "/user/:id",
      pathParams: z.object({ id: numericString(z.number()) }),
      body: z.any(),
      responses: {
        200: apiResultSchema(selectSystemUserSchema.omit({ password: true })),
      },
      metadata,
      summary: "删除某个系统用户",
    },
    // 批量删除用户
    batchRemove: {
      method: "DELETE",
      path: "/user/batchRemove",
      body: z.object({ ids: z.number().array() }),
      responses: {
        200: apiResultSchema(z.null()),
      },
      metadata,
      summary: "删除某个系统用户",
    },
    // 用户分配角色
    assignRole: {
      method: "POST",
      path: "/user/:id/assignRole",
      pathParams: z.object({ id: numericString(z.number()) }),
      body: z.object({
        roleIds: z.array(z.coerce.number()),
      }),
      responses: {
        200: apiResultSchema(z.null()),
      },
      metadata,
      summary: "用户分配角色",
    },
    // 重置密码
    resetPassword: {
      method: "PATCH",
      path: "/user/:id/resetPassword",
      pathParams: z.object({ id: numericString(z.number()) }),
      body: insertSystemUserSchema.pick({ password: true }),
      responses: {
        200: apiResultSchema(z.null()),
      },
      metadata,
      summary: "重置某个系统用户的密码",
    },
    // 获取role ids
    getRoleIds: {
      method: "GET",
      path: "/user/:id/getRoleIds",
      pathParams: z.object({ id: numericString(z.number()) }),
      responses: {
        200: apiResultSchema(z.number().array()),
      },
      metadata,
      summary: "获取某个系统用户的角色关系id",
    },
  },
  {
    pathPrefix: "/system",
  }
);
