import { initContract } from "@ts-rest/core";
import { z } from "zod";
import {
  apiResultSchema,
  BaseStatusSchema,
  numericString,
  RouterMetadata,
} from "../common/common";
import { insertSystemDeptSchema, selectSystemDeptSchema } from "@repo/drizzle";

const c = initContract();
const metadata = {
  openApiTags: ["系统-用户"],
} as RouterMetadata;

const routePrefix = "dept";
const routeSummary = "系统部门";

export const systemDept = c.router(
  {
    // 创建
    create: {
      method: "POST",
      path: `/dept`,
      body: insertSystemDeptSchema,
      responses: {
        201: apiResultSchema(selectSystemDeptSchema),
      },
      metadata,
      summary: `创建${routeSummary}`,
    },
    // 筛选所有
    filterAll: {
      method: "GET",
      path: "/dept",
      query: z.object({ name: z.string().optional() }).merge(BaseStatusSchema),
      responses: {
        200: apiResultSchema(selectSystemDeptSchema.array()),
      },
      metadata,
      summary: `获取所有${routeSummary}`,
    },
    // 根据id获取某个系统用户
    findById: {
      method: "GET",
      path: "/dept/:id",
      pathParams: z.object({ id: numericString(z.number()) }),
      responses: {
        200: apiResultSchema(selectSystemDeptSchema),
      },
      metadata,
      summary: `根据id获取某个${routeSummary}`,
    },
    // 更新某个用户
    update: {
      method: "PATCH",
      path: "/dept/:id",
      pathParams: z.object({ id: numericString(z.number()) }),
      body: insertSystemDeptSchema.partial(),
      responses: {
        200: apiResultSchema(selectSystemDeptSchema),
      },
      metadata,
      summary: `更新某个${routeSummary}`,
    },
    // 删除某个用户
    remove: {
      method: "DELETE",
      path: "/dept/:id",
      pathParams: z.object({ id: numericString(z.number()) }),
      body: z.any(),
      responses: {
        200: apiResultSchema(selectSystemDeptSchema),
      },
      metadata,
      summary: `删除某个${routeSummary}`,
    },
    // 用户分配角色
    assignRole: {
      method: "POST",
      path: "/dept/:id/assignRole",
      pathParams: z.object({ id: numericString(z.number()) }),
      body: z.object({
        roleIds: z.array(z.coerce.number()),
      }),
      responses: {
        200: apiResultSchema(z.null()),
      },
      metadata,
      summary: `${routeSummary}分配角色`,
    },
  },
  {
    pathPrefix: "/system",
  }
);
