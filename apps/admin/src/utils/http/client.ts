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
import { contract } from "@repo/contract";
import NProgress from "../progress";
import { formatToken, getToken } from "@/utils/auth";

import { http } from "./index";
import type { RequestMethods } from "./types";

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
        return {
          status: result.status,
          body: result.data,
          headers: result.headers as unknown as Headers
        };
      });
  }
});
