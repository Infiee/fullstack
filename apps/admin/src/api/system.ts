// import { http } from "@/utils/http";

import { client } from "@/utils/http/client";
import type { contract } from "@repo/contract";
import type { ClientInferRequest } from "@ts-rest/core";

type ResultTable = {
  success: boolean;
  data?: {
    /** 列表数据 */
    list: Array<any>;
    /** 总条目数 */
    total?: number;
    /** 每页显示条目个数 */
    pageSize?: number;
    /** 当前页数 */
    currentPage?: number;
  };
};

/** 获取系统管理-用户管理列表 */
export const getUserList = async (
  data: ClientInferRequest<typeof contract.systemUser.filterAll>["query"]
) => {
  const { body } = await client.systemUser.filterAll({ query: data });
  return body;
};

/** 系统管理-用户管理-获取所有角色列表 */
export const getAllRoleList = async () => {
  const { body } = await client.systemRole.getAll();
  return body;
};

/** 系统管理-用户管理-根据userId，获取对应角色id列表（userId：用户id） */
export const getRoleIds = async (
  data: ClientInferRequest<typeof contract.systemUser.getRoleIds>["params"]
) => {
  const { body } = await client.systemUser.getRoleIds({ params: data });
  return body;
};

/** 获取系统管理-角色管理列表 */
export const getRoleList = async (
  data: ClientInferRequest<typeof contract.systemRole.filterAll>["query"]
) => {
  const { body } = await client.systemRole.filterAll({ query: data });
  return body;
};

/** 获取系统管理-菜单管理列表 */
export const getMenuList = async () => {
  const { body } = await client.systemMenu.getAll();
  return body;
};

/** 获取系统管理-部门管理列表 */
export const getDeptList = async () => {
  const { body } = await client.systemDept.filterAll();
  return body;
};

/** 获取系统监控-在线用户列表 */
export const getOnlineLogsList = (data?: object) => {
  // return http.request<ResultTable>("post", "/online-logs", { data });
  return [];
};

/** 获取系统监控-登录日志列表 */
export const getLoginLogsList = (data?: object) => {
  // return http.request<ResultTable>("post", "/login-logs", { data });
  return [];
};

/** 获取系统监控-操作日志列表 */
export const getOperationLogsList = (data?: object) => {
  // return http.request<ResultTable>("post", "/operation-logs", { data });
  return [];
};

/** 获取系统监控-系统日志列表 */
export const getSystemLogsList = (data?: object) => {
  // return http.request<ResultTable>("post", "/system-logs", { data });
  return [];
};

/** 获取系统监控-系统日志-根据 id 查日志详情 */
export const getSystemLogsDetail = (data?: object) => {
  // return http.request<Result>("post", "/system-logs-detail", { data });
  return {};
};

/** 获取角色管理-权限-菜单权限 */
export const getRoleMenu = (data?: object) => {
  // return http.request<Result>("post", "/role-menu", { data });
  return [];
};

/** 获取角色管理-权限-菜单权限-根据角色 id 查对应菜单 */
export const getRoleMenuIds = (data?: object) => {
  // return http.request<Result>("post", "/role-menu-ids", { data });
  return [];
};

/** ----------- 自定义 ------------ */
// 用户
export const createUser = async (
  dto: ClientInferRequest<typeof contract.systemUser.create>["body"]
) => {
  const { body } = await client.systemUser.create({
    body: dto
  });
  return { data: body };
};

export const updateUser = async (
  id: number,
  dto?: ClientInferRequest<typeof contract.systemUser.update>["body"]
) => {
  const { body } = await client.systemUser.update({
    params: { id },
    body: dto
  });
  return { data: body };
};

export const resetUserPassword = async (
  id: number,
  dto?: ClientInferRequest<typeof contract.systemUser.resetPassword>["body"]
) => {
  const { body } = await client.systemUser.resetPassword({
    params: { id },
    body: dto
  });
  return { data: body };
};

export const deleteUser = async (id: number) => {
  const { body } = await client.systemUser.remove({
    params: { id },
    body: {}
  });
  return { data: body };
};

export const batchDeleteUser = async (ids: number[]) => {
  const { body } = await client.systemUser.batchRemove({
    body: { ids }
  });
  return { data: body };
};

export const assignRole = async (id: number, roleIds?: number[]) => {
  const { body } = await client.systemUser.assignRole({
    params: { id },
    body: { roleIds }
  });
  return { data: body };
};

// 部门
export const createDept = async (
  dto: ClientInferRequest<typeof contract.systemDept.create>["body"]
) => {
  const { body } = await client.systemDept.create({
    body: dto
  });
  return { data: body };
};

export const updateDept = async (
  id: number,
  dto?: ClientInferRequest<typeof contract.systemDept.update>["body"]
) => {
  const { body } = await client.systemDept.update({
    params: { id },
    body: dto
  });
  return { data: body };
};

export const deleteDept = async (id: number) => {
  const { body } = await client.systemDept.remove({
    params: { id },
    body: {}
  });
  return { data: body };
};
