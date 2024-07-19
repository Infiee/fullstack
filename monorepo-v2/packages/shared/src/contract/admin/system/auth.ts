import { initContract } from "@ts-rest/core";
import { z } from "zod";
import { selectSystemUserSchema } from "../../../drizzle";
import { RouterMetadata, apiResultSchema } from "../../common/common";
import { SystemRouteSchema } from "../../common/route-schema";

const c = initContract();
const metadata = {
  openApiTags: ["系统-认证"],
} as RouterMetadata;

const systemLoginSchema = z.object({
  uuid: z.string(),
  code: z.string(),
  username: z.string(),
  password: z.string(),
});
export type SystemLoginDto = z.infer<typeof systemLoginSchema>;

const systemGetInfoSchema = z.object({
  user: selectSystemUserSchema.omit({ password: true }),
  roles: z.array(z.string()),
  permissions: z.array(z.string()),
});
export type SystemGetInfo = z.infer<typeof systemGetInfoSchema>;
export type SystemRouterItem = z.infer<typeof SystemRouteSchema>;

export const systemAuth = c.router(
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
      body: systemLoginSchema,
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
              selectSystemUserSchema.pick({
                avatar: true,
                nickname: true,
                username: true,
              })
            )
        ),
        // 200: c.type<SystemLoginResult>(),
      },
      metadata,
      summary: "登录",
    },
    // 获取登录信息
    getInfo: {
      method: "GET",
      path: "/info",
      responses: {
        200: apiResultSchema(systemGetInfoSchema),
      },
      metadata,
      summary: "获取登录信息(用户、角色、权限)",
    },
    // 获取登录用户路由信息
    getRouters: {
      method: "GET",
      path: "/routes",
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
