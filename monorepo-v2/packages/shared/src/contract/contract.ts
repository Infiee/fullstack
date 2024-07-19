import { initContract } from "@ts-rest/core";
import { systemModule } from "./admin/system";

const c = initContract();

export const contract = c.router(
  {
    ...systemModule,
  },
  {
    pathPrefix: "/api",
    // 只显示定义的状态码
    strictStatusCodes: true,
    commonResponses: {},
  }
);

export * from "./common/enum";
export * from "./common/common";
export * from "./admin/system";