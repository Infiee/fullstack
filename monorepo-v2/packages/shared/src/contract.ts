import { initContract } from "@ts-rest/core";
import { sysModule } from "./admin/sys";

const c = initContract();

export const contract = c.router(
  {
    ...sysModule,
  },
  {
    pathPrefix: "/api",
    // 只显示定义的状态码
    strictStatusCodes: true,
    commonResponses: {},
  }
);
