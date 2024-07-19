import { initContract } from "@ts-rest/core";
import { z } from "zod";
import { selectSysUserSchema } from "../../drizzle";
import { RouterMetadata, apiResultSchema } from "../../common/common";

const c = initContract();
const metadata = {
  openApiTags: ["系统-认证"],
} as RouterMetadata;

const sysLoginSchema = z.object({
  uuid: z.string(),
  code: z.string(),
  username: z.string(),
  password: z.string(),
});
export type SysLoginDto = z.infer<typeof sysLoginSchema>;

const sysGetInfoSchema = z.object({
  user: selectSysUserSchema.omit({ password: true }),
  roles: z.array(z.string()),
  permissions: z.array(z.string()),
});
export type SysGetInfo = z.infer<typeof sysGetInfoSchema>;

export const sysAuth = c.router(
  {
    // 获取登录验证码
    getCaptchaImage: {
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
      body: sysLoginSchema,
      responses: {
        200: apiResultSchema(
          z
            .object({
              roles: z.string().array(),
              accessToken: z.string(),
              refreshToken: z.string(),
              expires: z.number(),
            })
            .merge(
              selectSysUserSchema.pick({
                avatar: true,
                nickname: true,
                username: true,
              })
            )
        ),
        // 200: c.type<SysLoginResult>(),
      },
      metadata,
      summary: "登录",
    },
    // 获取登录信息
    getInfo: {
      method: "GET",
      path: "/info",
      responses: {
        200: apiResultSchema(sysGetInfoSchema),
      },
      metadata,
      summary: "获取登录信息(用户、角色、权限)",
    },
    // 获取登录用户路由信息
    getRouters: {
      method: "GET",
      path: "/routes",
      responses: {
        // 200: apiResultSchema(z.array(SysRouteSchema)),
        200: apiResultSchema(z.array(z.any())),
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
    pathPrefix: "/sys",
  }
);
