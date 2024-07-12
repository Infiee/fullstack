export * from "./common/common";
export * from "./system/index";
export * from "./monitor/index";

import { RouterOptions, initContract } from "@ts-rest/core";
import {
  systemUser,
  systemRole,
  systemMenu,
  systemAuth,
  systemDept,
  monitorLoginLog,
  monitorOnline,
} from ".";

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

    monitorOnline,
    monitorLoginLog,
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
      // 500: z.object({
      //   code: z.coerce.number().default(-1),
      //   message: z.literal("服务器错误"),
      // }),
    },
  }
);
