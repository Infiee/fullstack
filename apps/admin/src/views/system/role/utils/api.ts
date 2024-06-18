import { client } from "@/utils/http/client";
import type { ClientInferRequest } from "@ts-rest/core";
import type { contract } from "@repo/contract";

export const getRoleList = async (
  params?: ClientInferRequest<typeof contract.systemRole.filterAll>["query"]
) => {
  const { body } = await client.systemRole.filterAll({
    query: params
  });
  return { data: body };
};

export const createRole = async (
  dto: ClientInferRequest<typeof contract.systemRole.create>["body"]
) => {
  const { body } = await client.systemRole.create({
    body: dto
  });
  return { data: body };
};

export const updateRole = async (
  id: number,
  dto?: ClientInferRequest<typeof contract.systemRole.update>["body"]
) => {
  const { body } = await client.systemRole.update({
    params: { id },
    body: dto
  });
  return { data: body };
};

export const deleteRole = async (id: number) => {
  const { body } = await client.systemRole.remove({
    params: { id },
    body: {}
  });
  return { data: body };
};

export const getRoleMenuIds = async (id: number) => {
  const { body } = await client.systemRole.getRoleMenuIds({
    params: { id }
  });
  return { data: body };
};

export const getMenu = async () => {
  const { body } = await client.systemMenu.getAll();
  return { data: body };
};

export const assignMenu = async (id: number, menuIds: number[]) => {
  const { body } = await client.systemRole.assignMenu({
    params: { id },
    body: { menuIds }
  });
  return { data: body };
};
