import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import { systemUser, systemRole, systemMenu, systemDept, systemLoginLog } from "../schema/admin/system/system.schema";

/* --------------------- 类型 --------------------------- */
// 用户
export type InsertSystemUser = typeof systemUser.$inferInsert;
export type SelectSystemUser = typeof systemUser.$inferSelect;
export const insertSystemUserSchema = createInsertSchema(systemUser);
export const selectSystemUserSchema = createSelectSchema(systemUser);

// 角色
export type InsertSystemRole = typeof systemRole.$inferInsert;
export type SelectSystemRole = typeof systemRole.$inferSelect;
export const insertSystemRoleSchema = createInsertSchema(systemRole);
export const selectSystemRoleSchema = createSelectSchema(systemRole);

// 菜单
export type InsertSystemMenu = typeof systemMenu.$inferInsert;
export type SelectSystemMenu = typeof systemMenu.$inferSelect;
export const insertSystemMenuSchema = createInsertSchema(systemMenu);
export const selectSystemMenuSchema = createSelectSchema(systemMenu);

// 部门
export type InsertSystemDept = typeof systemDept.$inferInsert;
export type SelectSystemDept = typeof systemDept.$inferSelect;
export const insertSystemDeptSchema = createInsertSchema(systemDept);
export const selectSystemDeptSchema = createSelectSchema(systemDept);

// 登录日志
export type InsertSystemLoginLog = typeof systemLoginLog.$inferInsert;
export type SelectSystemLoginLog = typeof systemLoginLog.$inferSelect;
export const insertSystemLoginLogSchema = createInsertSchema(systemLoginLog);
export const selectSystemLoginLogSchema = createSelectSchema(systemLoginLog);
// 测试
// import { pgEnum } from 'drizzle-orm/pg-core';
// export const enableEnum = pgEnum('enable', ['NORMAL', 'DISABLE']);
// export const isStatus = pgEnum('roles', ['ADMIN', 'USER']);
