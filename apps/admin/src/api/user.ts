// import { http } from "@/utils/http";
import { client } from "@/utils/http/client";
import type { contract } from "@repo/contract";
import type { ClientInferRequest } from "@ts-rest/core";

export type UserResult = {
  success: boolean;
  data: {
    /** 头像 */
    avatar: string;
    /** 用户名 */
    username: string;
    /** 昵称 */
    nickname: string;
    /** 当前登录用户的角色 */
    roles: Array<string>;
    /** `token` */
    accessToken: string;
    /** 用于调用刷新`accessToken`的接口时所需的`token` */
    refreshToken: string;
    /** `accessToken`的过期时间（格式'xxxx/xx/xx xx:xx:xx'） */
    expires: Date;
  };
};

export type RefreshTokenResult = {
  success: boolean;
  data: {
    /** `token` */
    accessToken: string;
    /** 用于调用刷新`accessToken`的接口时所需的`token` */
    refreshToken: string;
    /** `accessToken`的过期时间（格式'xxxx/xx/xx xx:xx:xx'） */
    expires: string;
  };
};

/** 登录 */
export const getLogin = async (
  data: ClientInferRequest<typeof contract.systemAuth.login>["body"]
) => {
  const { body } = await client.systemAuth.login({ body: data });
  return body;
};

/** 刷新`token` */
export const refreshTokenApi = async (
  data: ClientInferRequest<typeof contract.systemAuth.refreshToken>["body"]
) => {
  const { body } = await client.systemAuth.refreshToken({ body: data });
  return body;
};

// export const refreshTokenApi = (data?: object) => {
//   return http.request<RefreshTokenResult>("post", "/refresh-token", { data });
// };
