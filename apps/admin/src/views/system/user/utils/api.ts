/* eslint-disable @typescript-eslint/no-unused-vars */
import { client } from "@/utils/http/client";
import type { ClientInferRequest } from "@ts-rest/core";
import type { contract } from "@repo/contract";

// type Params = Parameters<typeof client.systemUser.getAll>[0];
export const getUserList = async (
  params?: ClientInferRequest<typeof contract.systemUser.getAll>["query"]
) => {
  const { body, status } = await client.systemUser.getAll({
    query: params
  });
  // if (status !== 200) return;
  return { data: body };
};

export const createUser = async (
  dto: ClientInferRequest<typeof contract.systemUser.create>["body"]
) => {
  const { body, status } = await client.systemUser.create({
    body: dto
  });
  // if (status !== 201) return;
  return { data: body };
};

export const updateUser = async (
  id: number,
  dto?: ClientInferRequest<typeof contract.systemUser.update>["body"]
) => {
  const { body, status } = await client.systemUser.update({
    params: { id },
    body: dto
  });
  // if (status !== 200) return;
  return { data: body };
};

export const resetUserPassword = async (
  id: number,
  dto?: ClientInferRequest<typeof contract.systemUser.resetPassword>["body"]
) => {
  const { body, status } = await client.systemUser.resetPassword({
    params: { id },
    body: dto
  });
  // if (status !== 200) return;
  return { data: body };
};

export const deleteUser = async (id: number) => {
  const { body, status } = await client.systemUser.remove({
    params: { id },
    body: {}
  });
  // if (status !== 200) return;
  return { data: body };
};

export const assignRole = async (id: number, roleIds?: number[]) => {
  const { body, status } = await client.systemUser.assignRole({
    params: { id },
    body: { roleIds }
  });
  // if (status !== 200) return;
  return { data: body };
};

export const getRoleIds = async (userId: number) => {
  const { body, status } = await client.systemUser.getRoleIds({
    params: { id: userId }
  });
  // if (status !== 200) return;
  return { data: body };
};

export const getAllRoleList = async (params?: any) => {
  const { body, status } = await client.systemRole.getAll();
  // if (status !== 200) return;
  return { data: body };
};

export const getDeptList = async (params?: any) => {
  return { data: [] };
};
