import { initContract } from "@ts-rest/core";
import { sysAuth } from "./sys";

const c = initContract();

export const contract = c.router(
  {
    sysAuth,
  },
  {
    pathPrefix: "/api",
    // 只显示定义的状态码
    strictStatusCodes: true,
    commonResponses: {},
  }
);