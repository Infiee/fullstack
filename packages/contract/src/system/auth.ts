import { initContract } from "@ts-rest/core";
import { ZodTypeAny, z } from "zod";
import { RouterMetadata, apiResultSchema } from "../common/common";
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

export const SystemLoginResultSchema = z
  .object({
    roles: z.string().array(),
    accessToken: z.string(),
    refreshToken: z.string(),
    expires: z.number(),
  })
  .merge(
    selectSystemUserSchema.pick({
      avatar: true,
      nickname: true,
      username: true,
    })
  );

export const systemAuth = c.router(
  {
    // 获取登录验证码
    getCaptchaImage: {
      method: "GET",
      path: "/captchaImage",
      responses: {
        200: apiResultSchema(
          z.object({
            img: z.string(),
            uuid: z.string(),
            captcha: z.string().optional(),
          })
        ),
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
        200: apiResultSchema(SystemLoginResultSchema),
        // 200: c.type<SystemLoginResult>(),
      },
      metadata,
      summary: "登录",
    },
    // 获取登录信息
    getInfo: {
      method: "GET",
      path: "/getInfo",
      responses: {
        200: apiResultSchema(SystemGetInfoSchema),
      },
      metadata,
      summary: "获取登录信息(用户、角色、权限)",
    },
    // 获取登录用户路由信息
    getRouters: {
      method: "GET",
      path: "/getRouters",
      responses: {
        200: apiResultSchema(z.array(SystemRouteSchema)),
      },
      metadata,
      summary: "获取登录用户路由信息",
    },
    // 刷新token
    refreshToken: {
      method: "POST",
      path: "/refresh-token",
      body: z.object({ refreshToken: z.string() }),
      responses: {
        200: apiResultSchema(
          z.object({
            accessToken: z.string(),
            refreshToken: z.string(),
            expires: z.number(),
          })
        ),
      },
      metadata,
      summary: "刷新token",
    },
  },
  {
    pathPrefix: "/system",
  }
);
