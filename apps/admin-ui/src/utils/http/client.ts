/* eslint-disable @typescript-eslint/no-unused-vars */
import axios, { isAxiosError } from "axios";
import type {
  Method,
  AxiosError,
  AxiosResponse,
  AxiosRequestConfig
} from "axios";
import { initClient, tsRestFetchApi } from "@ts-rest/core";
import type { ApiFetcherArgs, ClientInferResponseBody } from "@ts-rest/core";
import { contract } from "@repo/contract";
import { message } from "@/utils/message";
import NProgress from "../progress";
import { formatToken, getToken } from "@/utils/auth";
import { useUserStore } from "@/store/modules/user";

import { http } from "./index";
import type { RequestMethods } from "./types";

export type { ClientInferResponseBody };

// export const client = initClient(contract, {
//   baseUrl: "http://localhost:3000",
//   baseHeaders: {
//     "Content-Type": "application/json"
//   },
//   throwOnUnknownStatus: true,
//   api: async (args: ApiFetcherArgs) => {
//     // return tsRestFetchApi(args);

//     // 开启进度条动画
//     NProgress.start();
//     const { path, method, headers, body } = args;

//     // 获取token
//     const data = getToken();
//     if (data && data.accessToken) {
//       headers["Authorization"] = formatToken(data.accessToken);
//     }
//     const params = {
//       headers,
//       data: body
//     } as AxiosRequestConfig;

//     return http
//       .request<AxiosResponse<any, any>>(method as RequestMethods, path, params)
//       .then(result => {
//         return {
//           status: result.status,
//           body: result.data,
//           headers: result.headers as unknown as Headers
//         };
//       });
//   }
// });

export const client = initClient(contract, {
  baseUrl: "http://localhost:3000",
  baseHeaders: {
    "Content-Type": "application/json"
  },
  throwOnUnknownStatus: true,
  api: async (args: ApiFetcherArgs) => {
    // return tsRestFetchApi(args);

    // 开启进度条动画
    NProgress.start();
    const { path, method, headers, body } = args;

    // 获取token
    const data = getToken();
    if (data && data.accessToken) {
      headers["Authorization"] = formatToken(data.accessToken);
    }

    try {
      const result = await axios.request({
        method: method as Method,
        url: `${path}`,
        headers,
        data: body
      });
      // 关闭进度条动画
      NProgress.done();
      if (
        !(result.status >= 200 && result.status < 300) ||
        (result.status === 200 && result.data?.code)
      ) {
        message(result.data?.message, {
          type: "error",
          duration: 2500
        });
        return Promise.reject(result.data);
      }
      return {
        status: result.status,
        body: result.data,
        headers: result.headers as unknown as Headers
      };
    } catch (e: Error | AxiosError | any) {
      // 关闭进度条动画
      NProgress.done();
      if (isAxiosError(e)) {
        const error = e as AxiosError;
        const response = error.response as AxiosResponse;
        const data = response?.data as { code: number; message: string };
        message(data?.message || error.message, {
          type: "error",
          duration: 2500
        });
        /** 登录过期 */
        if (data?.code === 1001) {
          useUserStore().logOut();
        }
        return Promise.reject({
          status: response?.status,
          body: response?.data,
          headers: response?.headers as unknown as Headers
        });
      }
      return Promise.reject(e);
    }
  }
});

// import { contract } from "@repo/contract";
// import { initQueryClient } from "@ts-rest/vue-query";
// import { type ApiFetcherArgs, tsRestFetchApi } from "@ts-rest/core";
// import { message } from "@/utils/message";

// export const client = initQueryClient(contract, {
//   baseUrl: "http://localhost:3000",
//   baseHeaders: getHeaders(),
//   api: async (args: ApiFetcherArgs) => {
//     console.log("args--", args);

//     const result = await tsRestFetchApi(args);

//     if (!(result.status >= 200 && result.status < 300)) {
//       const body = result.body as any;
//       message(body?.message, {
//         type: "error",
//         duration: 2500
//       });
//     }

//     return result;
//   }
// });

// function getHeaders() {
//   return {
//     authorization:
//       "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6ImFkbWluIiwiaWQiOjEsImV4cGlyZVRpbWUiOjE3MTcxMTk4NTMsImlhdCI6MTcxNzAzMzQ1M30.MJ7Pvf_9Gqe61pIqCfqions0hcSoYdUepfQTLVBJAiI"
//   };
// }
