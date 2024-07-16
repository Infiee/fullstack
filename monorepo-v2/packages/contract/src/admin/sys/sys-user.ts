import { initContract } from "@ts-rest/core";
import { z } from "zod";
import { insertSysUserSchema, selectSysUserSchema } from "@repo/drizzle";
import {
  apiResultSchema,
  basePaginationAndSortSchema,
  baseStatusSchema,
  numericString,
  RouterMetadata,
} from "../../common/common";

const c = initContract();
const metadata = {
  openApiTags: ["系统-用户"],
} as RouterMetadata;

const basePath = "users";
const baseSummary = "系统用户";

export const sysUser = c.router(
  {
    // 创建用户
    create: {
      method: "POST",
      path: `/${basePath}`,
      body: insertSysUserSchema,
      responses: {
        201: apiResultSchema(selectSysUserSchema.omit({ password: true })),
      },
      metadata,
      summary: `创建${baseSummary}`,
    },
    // 筛选所有用户
    filterAll: {
      method: "GET",
      path: `/${basePath}`,
      query: z
        .object({
          username: z.string().optional(),
          phone: z.string().optional(),
          deptId: numericString(z.number()).optional(),
        })
        .merge(basePaginationAndSortSchema)
        .merge(baseStatusSchema),
      responses: {
        200: apiResultSchema(
          z.object({
            list: selectSysUserSchema
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
      summary: `获取所有${baseSummary}`,
    },
    // 根据id获取某个系统用户
    findById: {
      method: "GET",
      path: `/${basePath}/:id`,
      pathParams: z.object({ id: numericString(z.number()) }),
      responses: {
        200: apiResultSchema(selectSysUserSchema.omit({ password: true })),
      },
      metadata,
      summary: `根据id获取某个${baseSummary}`,
    },
    // 更新某个用户
    update: {
      method: "PATCH",
      path: `/${basePath}/:id`,
      pathParams: z.object({ id: numericString(z.number()) }),
      body: insertSysUserSchema.omit({ password: true }).partial(),
      responses: {
        200: apiResultSchema(selectSysUserSchema.omit({ password: true })),
      },
      metadata,
      summary: `更新某个${baseSummary}`,
    },
    // 删除某个用户
    remove: {
      method: "DELETE",
      path: `/${basePath}/:id`,
      pathParams: z.object({ id: numericString(z.number()) }),
      body: z.any(),
      responses: {
        200: apiResultSchema(selectSysUserSchema.omit({ password: true })),
      },
      metadata,
      summary: `删除某个${baseSummary}`,
    },
    // 批量删除用户
    batchRemove: {
      method: "POST",
      path: `/${basePath}/batch-remove`,
      body: z.object({ ids: z.number().array() }),
      responses: {
        200: apiResultSchema(z.null()),
      },
      metadata,
      summary: `批量删除${baseSummary}`,
    },
    // 用户分配角色
    assignRole: {
      method: "POST",
      path: `/${basePath}/:id/roles`,
      pathParams: z.object({ id: numericString(z.number()) }),
      body: z.object({
        roleIds: z.array(z.coerce.number()),
      }),
      responses: {
        200: apiResultSchema(z.null()),
      },
      metadata,
      summary: `${baseSummary}分配角色`,
    },
    // 重置密码
    resetPassword: {
      method: "PUT",
      path: `/${basePath}/:id/password`,
      pathParams: z.object({ id: numericString(z.number()) }),
      body: insertSysUserSchema.pick({ password: true }),
      responses: {
        200: apiResultSchema(z.null()),
      },
      metadata,
      summary: `重置某个${baseSummary}的密码`,
    },
    // 获取role ids
    getRoleIds: {
      method: "GET",
      path: `/${basePath}/:id/role-ids`,
      pathParams: z.object({ id: numericString(z.number()) }),
      responses: {
        200: apiResultSchema(z.number().array()),
      },
      metadata,
      summary: `获取某个${baseSummary}的角色关系id`,
    },
  },
  {
    pathPrefix: "/sys",
  }
);
