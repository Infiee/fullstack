import { initContract } from "@ts-rest/core";
import { z } from "zod";
import {
  BasePaginationSchema,
  BaseStatusSchema,
  RouterMetadata,
  apiResultSchema,
  basePaginationAndSortSchema,
  numericString,
} from "../common/common";
import {
  insertSystemRoleSchema,
  selectSystemMenuSchema,
  selectSystemRoleSchema,
} from "@repo/drizzle";

const c = initContract();
const metadata = {
  openApiTags: ["系统-角色"],
} as RouterMetadata;

export const systemRoleSchema = insertSystemRoleSchema.extend({
  name: z.string().optional().default("测试"),
  code: z.string().optional().default("test"),
  remark: z.string().optional().default("测试角色"),
  sort: z.coerce.number().optional().default(0),
});

const filterRoleSchema = z
  .object({
    name: z.string().optional(),
    code: z.string().optional(),
  })
  .merge(basePaginationAndSortSchema)
  .merge(BaseStatusSchema);

export const systemRole = c.router(
  {
    // 创建角色
    create: {
      method: "POST",
      path: "/role",
      body: systemRoleSchema.omit({ id: true }),
      responses: {
        201: apiResultSchema(selectSystemRoleSchema),
      },
      metadata,
      summary: "创建系统角色",
    },
    // 获取所有角色
    getAll: {
      method: "GET",
      path: "/role",
      responses: {
        200: apiResultSchema(selectSystemRoleSchema.array()),
      },
      metadata,
      summary: "获取所有系统角色",
    },
    // 获取某个角色
    getOne: {
      method: "GET",
      path: "/role/:id",
      pathParams: z.object({ id: numericString(z.number()) }),
      responses: {
        200: apiResultSchema(selectSystemRoleSchema),
      },
      metadata,
      summary: "获取某个系统角色",
    },
    // 更新某个角色
    update: {
      method: "PATCH",
      path: "/role/:id",
      pathParams: z.object({ id: numericString(z.number()) }),
      body: systemRoleSchema.omit({ id: true }).partial(),
      responses: {
        200: apiResultSchema(selectSystemRoleSchema),
      },
      metadata,
      summary: "更新某个系统角色",
    },
    // 删除某个角色
    remove: {
      method: "DELETE",
      path: "/role/:id",
      pathParams: z.object({ id: numericString(z.number()) }),
      body: z.any(),
      responses: {
        200: apiResultSchema(z.object({})),
      },
      metadata,
      summary: "删除某个系统角色",
    },
    // 角色分配用户
    assignUser: {
      method: "POST",
      path: "/role/:id/assignUser",
      pathParams: z.object({ id: numericString(z.number()) }),
      body: z.object({
        userIds: z.array(z.coerce.number()),
      }),
      responses: {
        200: apiResultSchema(z.any()),
      },
      metadata,
      summary: "角色分配用户",
    },
    // 角色分配菜单
    assignMenu: {
      method: "POST",
      path: "/role/:id/assignMenu",
      pathParams: z.object({ id: numericString(z.number()) }),
      body: z.object({
        menuIds: z.array(z.coerce.number()),
      }),
      responses: {
        200: apiResultSchema(z.any()),
      },
      metadata,
      summary: "角色分配菜单",
    },
    // 查找过滤所有角色
    filterAll: {
      method: "GET",
      path: "/role/filter",
      query: filterRoleSchema,
      responses: {
        200: apiResultSchema(
          z.object({
            list: selectSystemRoleSchema.array(),
            total: z.number(),
          })
        ),
      },
      metadata,
      summary: "获取所有系统角色",
    },
    // 角色菜单
    getRoleMenu: {
      method: "GET",
      path: "/role/:id/roleMenu",
      pathParams: z.object({ id: numericString(z.number()) }),
      responses: {
        200: apiResultSchema(selectSystemMenuSchema.array()),
      },
      metadata,
      summary: "获取菜单、角色",
    },
    // 角色菜单
    getRoleMenuIds: {
      method: "GET",
      path: "/role/:id/roleMenuIds",
      pathParams: z.object({ id: numericString(z.number()) }),
      responses: {
        200: apiResultSchema(z.number().array()),
      },
      metadata,
      summary: "获取菜单、角色关系id",
    },
  },
  {
    pathPrefix: "/system",
  }
);
