import { initContract } from "@ts-rest/core";
import { z } from "zod";
import { insertSysDeptSchema, selectSysDeptSchema } from "../../drizzle";
import {
  apiResultSchema,
  baseStatusSchema,
  numericString,
  RouterMetadata,
} from "../../common/common";

const c = initContract();
const metadata = {
  openApiTags: ["系统-部门"],
} as RouterMetadata;

const basePath = "depts";
const baseSummary = "系统部门";

export const sysDept = c.router(
  {
    // 创建
    create: {
      method: "POST",
      path: `/${basePath}`,
      body: insertSysDeptSchema,
      responses: {
        201: apiResultSchema(selectSysDeptSchema),
      },
      metadata,
      summary: `创建${baseSummary}`,
    },
    // 筛选所有
    filterAll: {
      method: "GET",
      path: `/${basePath}`,
      query: z.object({ name: z.string().optional() }).merge(baseStatusSchema),
      responses: {
        200: apiResultSchema(selectSysDeptSchema.array()),
      },
      metadata,
      summary: `获取所有${baseSummary}`,
    },
    // 根据id获取某个
    findById: {
      method: "GET",
      path: `/${basePath}/:id`,
      pathParams: z.object({ id: numericString(z.number()) }),
      responses: {
        200: apiResultSchema(selectSysDeptSchema),
      },
      metadata,
      summary: `根据id获取某个${baseSummary}`,
    },
    // 更新某个
    update: {
      method: "PATCH",
      path: `/${basePath}/:id`,
      pathParams: z.object({ id: numericString(z.number()) }),
      body: insertSysDeptSchema.partial(),
      responses: {
        200: apiResultSchema(selectSysDeptSchema),
      },
      metadata,
      summary: `更新某个${baseSummary}`,
    },
    // 删除某个
    remove: {
      method: "DELETE",
      path: `/${basePath}/:id`,
      pathParams: z.object({ id: numericString(z.number()) }),
      body: z.any(),
      responses: {
        200: apiResultSchema(selectSysDeptSchema),
      },
      metadata,
      summary: `删除某个${baseSummary}`,
    },
    // 部门分配角色
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
  },
  {
    pathPrefix: "/sys",
  }
);
