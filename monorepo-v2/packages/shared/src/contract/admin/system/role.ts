import { initContract } from "@ts-rest/core";
import { z } from "zod";
import {
  insertSystemRoleSchema,
  selectSystemMenuSchema,
  selectSystemRoleSchema,
} from "../../../drizzle";
import {
  baseStatusSchema,
  RouterMetadata,
  apiResultSchema,
  basePaginationAndSortSchema,
  numericString,
} from "../../common/common";

const c = initContract();
const metadata = {
  openApiTags: ["系统-角色"],
} as RouterMetadata;

const basePath = "roles";
const baseSummary = "系统角色";

const systemRoleSchema = insertSystemRoleSchema.extend({
  name: z.string().optional().default("测试"),
  code: z.string().optional().default("test"),
  remark: z.string().optional().default("测试角色"),
  sort: z.coerce.number().optional().default(0),
});

export const systemRole = c.router(
  {
    // 创建角色
    create: {
      method: "POST",
      path: `/${basePath}`,
      body: systemRoleSchema.omit({ id: true }),
      responses: {
        201: apiResultSchema(selectSystemRoleSchema),
      },
      metadata,
      summary: `创建${baseSummary}`,
    },
    // 获取所有角色
    getAll: {
      method: "GET",
      path: `/${basePath}`,
      responses: {
        200: apiResultSchema(selectSystemRoleSchema.array()),
      },
      metadata,
      summary: `获取所有${baseSummary}`,
    },
    // 获取某个角色
    getOne: {
      method: "GET",
      path: `/${basePath}/:id`,
      pathParams: z.object({ id: numericString(z.number()) }),
      responses: {
        200: apiResultSchema(selectSystemRoleSchema),
      },
      metadata,
      summary: `获取某个${baseSummary}`,
    },
    // 更新某个角色
    update: {
      method: "PATCH",
      path: `/${basePath}/:id`,
      pathParams: z.object({ id: numericString(z.number()) }),
      body: systemRoleSchema.omit({ id: true }).partial(),
      responses: {
        200: apiResultSchema(selectSystemRoleSchema),
      },
      metadata,
      summary: `更新某个${baseSummary}`,
    },
    // 删除某个角色
    remove: {
      method: "DELETE",
      path: `/${basePath}/:id`,
      pathParams: z.object({ id: numericString(z.number()) }),
      body: z.any(),
      responses: {
        200: apiResultSchema(z.object({})),
      },
      metadata,
      summary: `删除某个${baseSummary}`,
    },
    // 角色分配用户
    assignUser: {
      method: "POST",
      path: `/${basePath}/:id/users`,
      pathParams: z.object({ id: numericString(z.number()) }),
      body: z.object({
        userIds: z.array(z.coerce.number()),
      }),
      responses: {
        200: apiResultSchema(z.any()),
      },
      metadata,
      summary: `${baseSummary}分配用户`,
    },
    // 角色分配菜单
    assignMenu: {
      method: "POST",
      path: `/${basePath}/:id/menus`,
      pathParams: z.object({ id: numericString(z.number()) }),
      body: z.object({
        menuIds: z.array(z.coerce.number()),
      }),
      responses: {
        200: apiResultSchema(z.any()),
      },
      metadata,
      summary: `${baseSummary}分配菜单`,
    },
    // 查找过滤所有角色
    filterAll: {
      method: "GET",
      path: `/${basePath}/filter`,
      query: z
        .object({
          name: z.string().optional(),
          code: z.string().optional(),
        })
        .merge(basePaginationAndSortSchema)
        .merge(baseStatusSchema),
      responses: {
        200: apiResultSchema(
          z.object({
            list: selectSystemRoleSchema.array(),
            total: z.number(),
          })
        ),
      },
      metadata,
      summary: `获取所有${baseSummary}`,
    },
    // 角色菜单
    getRoleMenu: {
      method: "GET",
      path: `/${basePath}/:id/menus`,
      pathParams: z.object({ id: numericString(z.number()) }),
      responses: {
        200: apiResultSchema(selectSystemMenuSchema.array()),
      },
      metadata,
      summary: `获取系统菜单、${baseSummary}`,
    },
    // 角色菜单
    getRoleMenuIds: {
      method: "GET",
      path: `/${basePath}/:id/menu-ids`,
      pathParams: z.object({ id: numericString(z.number()) }),
      responses: {
        200: apiResultSchema(z.number().array()),
      },
      metadata,
      summary: `获取系统菜单、${baseSummary}关系id`,
    },
  },
  {
    pathPrefix: "/system",
  }
);
