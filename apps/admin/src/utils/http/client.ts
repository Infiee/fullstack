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
import { ApiResultType, contract } from "@repo/contract";
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
  throwOnUnknownStatus: true,
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
      .then(result => {
        console.log("result--", result);
        const data = result.data as ApiResultType;
        if (!data.success) {
          message(data?.message, {
            type: "error",
            duration: 2500
          });
          if (data.code === 401) {
            useUserStoreHook().logOut();
          }
          return;
        }
        return {
          status: result.status,
          body: result.data,
          headers: result.headers as unknown as Headers
        };
      })
      .catch(err => {
        const data = err?.response?.data;
        const result = err?.response as AxiosResponse;
        if (data.code === 401) {
          useUserStoreHook().logOut();
        }
        return {
          status: result.status,
          body: result.data,
          headers: result.headers as unknown as Headers
        };
      });
  }
});
