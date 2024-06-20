// import { http } from "@/utils/http";
import { client } from "@/utils/http/client";

export const getAsyncRoutes = async () => {
  // return http.request<Result>("get", "/get-async-routes");
  const { body } = await client.systemAuth.getRouters();
  return body;
};
