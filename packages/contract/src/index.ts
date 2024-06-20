export * from "./common/common";

export * from "./system/user";
export * from "./system/role";
export * from "./system/menu";
export * from "./system/auth";
export * from "./system/dept";

import { initContract } from "@ts-rest/core";
import { systemUser, systemRole, systemMenu, systemAuth, systemDept } from ".";

import { setErrorMap } from "./common/custom-zod-error";
import { z } from "zod";
setErrorMap();

const c = initContract();
export const contract = c.router(
  {
    systemAuth,
    systemUser,
    systemRole,
    systemMenu,
    systemDept,
  },
  {
    pathPrefix: "/api",
    // 只显示定义的状态码
    strictStatusCodes: true,
    // strictStatusCodes: false,
    commonResponses: {
      // 400: z.object({
      //   code: z.coerce.number().default(-1),
      //   message: z.string(),
      // }),
      // 401: z.object({
      //   code: z.coerce.number().default(-1),
      //   message: z.string(),
      // }),
      // 404: z.object({
      //   code: z.coerce.number().default(-1),
      //   message: z.string().default("未找到"),
      // }),
      // 500: z.object({
      //   code: z.coerce.number().default(-1),
      //   message: z.literal("服务器错误"),
      // }),
    },
  }
);
