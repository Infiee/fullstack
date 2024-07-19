import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import { sysUser, sysRole, sysMenu, sysDept, sysLoginLog } from "../schema/admin/sys/sys.schema";

/* --------------------- 类型 --------------------------- */
// 用户
export type InsertSysUser = typeof sysUser.$inferInsert;
export type SelectSysUser = typeof sysUser.$inferSelect;
export const insertSysUserSchema = createInsertSchema(sysUser);
export const selectSysUserSchema = createSelectSchema(sysUser);

// 角色
export type InsertSysRole = typeof sysRole.$inferInsert;
export type SelectSysRole = typeof sysRole.$inferSelect;
export const insertSysRoleSchema = createInsertSchema(sysRole);
export const selectSysRoleSchema = createSelectSchema(sysRole);

// 菜单
export type InsertSysMenu = typeof sysMenu.$inferInsert;
export type SelectSysMenu = typeof sysMenu.$inferSelect;
export const insertSysMenuSchema = createInsertSchema(sysMenu);
export const selectSysMenuSchema = createSelectSchema(sysMenu);

// 部门
export type InsertSysDept = typeof sysDept.$inferInsert;
export type SelectSysDept = typeof sysDept.$inferSelect;
export const insertSysDeptSchema = createInsertSchema(sysDept);
export const selectSysDeptSchema = createSelectSchema(sysDept);

// 登录日志
export type InsertSysLoginLog = typeof sysLoginLog.$inferInsert;
export type SelectSysLoginLog = typeof sysLoginLog.$inferSelect;
export const insertSysLoginLogSchema = createInsertSchema(sysLoginLog);
export const selectSysLoginLogSchema = createSelectSchema(sysLoginLog);
// 测试
// import { pgEnum } from 'drizzle-orm/pg-core';
// export const enableEnum = pgEnum('enable', ['NORMAL', 'DISABLE']);
// export const isStatus = pgEnum('roles', ['ADMIN', 'USER']);
