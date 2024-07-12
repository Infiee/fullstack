import { initContract } from "@ts-rest/core";
import { z } from "zod";
import {
  apiResultSchema,
  basePaginationAndSortSchema,
  BaseStatusSchema,
  numericString,
  RouterMetadata,
} from "../common/common";
import { selectSystemLoginLogSchema } from "@repo/drizzle";

const c = initContract();
const metadata = {
  openApiTags: ["系统监控-登录日志"],
} as RouterMetadata;

export const monitorLoginLog = c.router(
  {
    // 筛选所有用户
    filterAll: {
      method: "GET",
      path: "/login-log",
      query: z
        .object({ username: z.string().optional() })
        .merge(basePaginationAndSortSchema)
        .merge(BaseStatusSchema),
      responses: {
        200: apiResultSchema(
          z.object({
            list: selectSystemLoginLogSchema.array(),
            total: z.number(),
          })
        ),
      },
      metadata,
      summary: "获取所有登录日志",
    },
    // 删除某个用户
    remove: {
      method: "DELETE",
      path: "/login-log/:id",
      pathParams: z.object({ id: numericString(z.number()) }),
      body: z.any(),
      responses: {
        200: apiResultSchema(selectSystemLoginLogSchema),
      },
      metadata,
      summary: "删除某个系统用户",
    },
  },
  {
    pathPrefix: "/monitor",
  }
);
