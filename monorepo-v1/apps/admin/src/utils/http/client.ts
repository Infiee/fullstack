/* eslint-disable @typescript-eslint/no-unused-vars */
import axios, { isAxiosError } from "axios";
import type {
  Method,
  AxiosError,
  AxiosResponse,
  AxiosRequestConfig
} from "axios";
import { initClient } from "@ts-rest/core";
import type { ApiFetcherArgs, ClientInferResponseBody } from "@ts-rest/core";
import { type ApiResultType, contract } from "@repo/contract";
import NProgress from "../progress";
import { formatToken, getToken } from "@/utils/auth";

import { http } from "./index";
import type { RequestMethods } from "./types";
import { useUserStoreHook } from "@/store/modules/user";
import { message } from "@/utils/message";

export type { ClientInferResponseBody };

export const client = initClient(contract, {
  baseUrl: "http://localhost:3000",
  baseHeaders: {
    "Content-Type": "application/json"
  },
  // 如果status和合约定义的不一样 是否报错
  throwOnUnknownStatus: false,
  // validateResponse: false,
  api: async (args: ApiFetcherArgs) => {
    // 开启进度条动画
    NProgress.start();
    const { path, method, headers, body } = args;

    // 获取token
    // const data = getToken();
    // if (data && data.accessToken) {
    //   headers["Authorization"] = formatToken(data.accessToken);
    // }
    const params = {
      headers,
      data: body
    } as AxiosRequestConfig;

    return http
      .request<AxiosResponse<any, any>>(method as RequestMethods, path, params)
      .then(res => {
        // console.log("res--", res);
        const data = res.data as ApiResultType;
        if (!data.success) {
          if (data.code === 401) {
            message(data?.message, { type: "error", duration: 2500 });
            useUserStoreHook().logOut();
          }
        }
        return {
          status: res.status,
          body: res.data,
          headers: res.headers as unknown as Headers
        };
      })
      .catch(err => {
        const res = err?.response as AxiosResponse;
        console.log("api异常：", res);
        if ([401, 403].includes(res.status)) {
          useUserStoreHook().logOut();
        }
        return {
          status: res.status,
          body: res.data,
          headers: res.headers as unknown as Headers
        };
      });
  }
});
