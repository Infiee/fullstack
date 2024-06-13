import { initContract } from "@ts-rest/core";
import { z } from "zod";
import { RouterMetadata } from "../common/common";
import { insertSystemMenuSchema, selectSystemMenuSchema } from "@repo/drizzle";

const c = initContract();
const metadata = {
  openApiTags: ["系统-菜单"],
} as RouterMetadata;

export const systemMenu = c.router(
  {
    // 创建菜单
    create: {
      method: "POST",
      path: "/menu",
      body: insertSystemMenuSchema.omit({ id: true }),
      responses: {
        201: selectSystemMenuSchema,
      },
      metadata,
      summary: "创建系统菜单",
    },
    // 获取所有菜单
    getAll: {
      method: "GET",
      path: "/menu",
      responses: {
        200: selectSystemMenuSchema.array(),
      },
      metadata,
      summary: "获取所有系统菜单",
    },
    // 获取某个菜单
    getOne: {
      method: "GET",
      path: "/menu/:id",
      pathParams: z.object({
        id: z.coerce.number(),
      }),
      responses: {
        200: selectSystemMenuSchema,
      },
      metadata,
      summary: "获取某个系统菜单",
    },
    // 更新某个菜单
    update: {
      method: "PATCH",
      path: "/menu/:id",
      pathParams: z.object({
        id: z.coerce.number(),
      }),
      body: insertSystemMenuSchema.omit({ id: true }).partial(),
      responses: {
        200: selectSystemMenuSchema,
      },
      metadata,
      summary: "更新某个系统菜单",
    },
    // 删除某个菜单
    remove: {
      method: "DELETE",
      path: "/menu/:id",
      pathParams: z.object({
        id: z.coerce.number(),
      }),
      body: z.any(),
      responses: {
        204: z.object({}),
      },
      metadata,
      summary: "删除某个系统菜单",
    },
  },
  {
    pathPrefix: "/system",
  }
);
