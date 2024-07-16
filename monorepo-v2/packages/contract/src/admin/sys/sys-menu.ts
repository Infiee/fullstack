import { initContract } from "@ts-rest/core";
import { z } from "zod";
import { insertSysMenuSchema, selectSysMenuSchema } from "@repo/drizzle";
import {
  RouterMetadata,
  apiResultSchema,
  numericString,
} from "../../common/common";

const c = initContract();
const metadata = {
  openApiTags: ["系统-菜单"],
} as RouterMetadata;

const basePath = "menus";
const baseSummary = "系统菜单";

export const sysMenu = c.router(
  {
    // 创建菜单
    create: {
      method: "POST",
      path: `/${basePath}`,
      body: insertSysMenuSchema.omit({ id: true }),
      responses: {
        201: apiResultSchema(selectSysMenuSchema),
      },
      metadata,
      summary: `创建${baseSummary}`,
    },
    // 获取所有菜单
    getAll: {
      method: "GET",
      path: `/${basePath}`,
      responses: {
        200: apiResultSchema(z.array(selectSysMenuSchema)),
      },
      metadata,
      summary: `获取所有${baseSummary}`,
    },
    // 获取某个菜单
    getOne: {
      method: "GET",
      path: `/${basePath}/:id`,
      pathParams: z.object({ id: numericString(z.number()) }),
      responses: {
        200: apiResultSchema(selectSysMenuSchema),
      },
      metadata,
      summary: `获取某个${baseSummary}`,
    },
    // 更新某个菜单
    update: {
      method: "PATCH",
      path: `/${basePath}/:id`,
      pathParams: z.object({ id: numericString(z.number()) }),
      body: insertSysMenuSchema.omit({ id: true }).partial(),
      responses: {
        200: apiResultSchema(selectSysMenuSchema),
      },
      metadata,
      summary: `更新某个${baseSummary}`,
    },
    // 删除某个菜单
    remove: {
      method: "DELETE",
      path: `/${basePath}/:id`,
      pathParams: z.object({ id: numericString(z.number()) }),
      body: z.any(),
      responses: {
        200: apiResultSchema(z.any()),
      },
      metadata,
      summary: `删除某个${baseSummary}`,
    },
  },
  {
    pathPrefix: "/sys",
  }
);
