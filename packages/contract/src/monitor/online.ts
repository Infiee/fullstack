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

// const onlineResultSchema = z.object({
//   id: z.number(),
//   username: z.string(),
//   ip: z.string().ip(),
//   address: z.string(),
//   system: z.string(),
//   browser: z.string(),
//   loginTime: z.date(),
// });

const c = initContract();
const metadata = {
  openApiTags: ["系统监控-在线用户"],
} as RouterMetadata;

export const monitorOnline = c.router(
  {
    // 筛选所有用户
    filterAll: {
      method: "GET",
      path: "/online",
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
    // remove: {
    //   method: "DELETE",
    //   path: "/login-log/:id",
    //   pathParams: z.object({ id: numericString(z.number()) }),
    //   body: z.any(),
    //   responses: {
    //     200: apiResultSchema(selectSystemLoginLogSchema),
    //   },
    //   metadata,
    //   summary: "删除某个系统用户",
    // },
  },
  {
    pathPrefix: "/monitor",
  }
);
