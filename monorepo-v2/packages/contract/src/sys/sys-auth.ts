import { initContract } from "@ts-rest/core";
import { ZodTypeAny, z } from "zod";
import { apiResultSchema, RouterMetadata } from "../common/common";

const c = initContract();

const metadata = {
  openApiTags: ["系统-认证"],
} as RouterMetadata;

export const selectSystemUserSchema = z.object({ password: z.string() });

/** 登录schema */
export const SystemLoginSchema = z.object({
  uuid: z.string(),
  code: z.string(),
  username: z.string(),
  password: z.string(),
});
export type SystemLoginDto = z.infer<typeof SystemLoginSchema>;

/** 登录结果schema */
export const SystemGetInfoSchema = z.object({
  user: selectSystemUserSchema.omit({ password: true }),
  roles: z.array(z.string()),
  permissions: z.array(z.string()),
});
export type SystemGetInfo = z.infer<typeof SystemGetInfoSchema>;

/** 登录结果schema */
export const SystemLoginResultSchema = z
  .object({
    roles: z.string().array(),
    accessToken: z.string(),
    refreshToken: z.string(),
    expires: z.number(),
  })
  .merge(
    selectSystemUserSchema.pick({
      // avatar: true,
      // nickname: true,
      // username: true,
    })
  );

/** 系统登录合约 */
export const sysAuth = c.router(
  {
    // 获取登录验证码
    getCaptcha: {
      method: "GET",
      path: "/captcha",
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
        200: apiResultSchema(z.any()),
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
    pathPrefix: "/system/auth",
  }
);
