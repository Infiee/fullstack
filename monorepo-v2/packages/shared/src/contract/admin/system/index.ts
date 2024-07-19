import { systemAuth } from "./auth";
import { systemUser } from "./user";
import { systemRole } from "./role";
import { systemMenu } from "./menu";
import { systemDept } from "./dept";

export const systemModule = {
  systemAuth,
  systemUser,
  systemRole,
  systemMenu,
  systemDept,
};

export * from "./auth";
export * from "./user";
export * from "./role";
export * from "./menu";
export * from "./dept";
