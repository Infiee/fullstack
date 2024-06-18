import { initContract } from "@ts-rest/core";
import { z } from "zod";
import { RouterMetadata } from "../common/common";
import { SystemRouteSchema } from "../common/route.schema";
import { selectSystemUserSchema } from "@repo/drizzle";

const c = initContract();
const metadata = {
  openApiTags: ["系统-认证"],
} as RouterMetadata;

export const SystemLoginSchema = z.object({
  uuid: z.string(),
  code: z.string(),
  username: z.string(),
  password: z.string(),
});
export type SystemLoginDto = z.infer<typeof SystemLoginSchema>;

export const SystemGetInfoSchema = z.object({
  user: selectSystemUserSchema.omit({ password: true }),
  roles: z.array(z.string()),
  permissions: z.array(z.string()),
});
export type SystemGetInfo = z.infer<typeof SystemGetInfoSchema>;

export type SystemRouterItem = z.infer<typeof SystemRouteSchema>;

// type SystemLoginResult = { accessToken: string };
// type ErrorResult = { code: number; message: string };

export const systemAuth = c.router(
  {
    // 获取登录验证码
    getCaptchaImage: {
      method: "GET",
      path: "/captchaImage",
      responses: {
        200: z.object({ img: z.string(), uuid: z.string() }),
        // 400: z.object({
        //   code: z.coerce.number().default(-1),
        //   message: z.string(),
        // }),
      },
      metadata,
      summary: "获取登录验证码",
    },
    // 登录
    login: {
      method: "POST",
      path: "/login",
      body: SystemLoginSchema,
      responses: {
        200: z.object({ accessToken: z.string() }),
        // 200: c.type<SystemLoginResult>(),
        // 400: z.object({
        //   code: z.coerce.number().default(-1),
        //   message: z.string(),
        // }),
      },
      metadata,
      summary: "登录",
    },
    // 获取登录信息
    getInfo: {
      method: "GET",
      path: "/getInfo",
      responses: {
        200: SystemGetInfoSchema,
      },
      metadata,
      summary: "获取登录信息(用户、角色、权限)",
    },
    // 获取登录用户路由信息
    getRouters: {
      method: "GET",
      path: "/getRouters",
      responses: {
        200: z.array(SystemRouteSchema),
        // 200: z.any(),
      },
      metadata,
      summary: "获取登录用户路由信息",
    },
  },
  {
    pathPrefix: "/system",
  }
);
