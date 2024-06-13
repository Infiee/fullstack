import {
  AnyPgColumn,
  boolean,
  integer,
  pgTable,
  primaryKey,
  serial,
  text,
} from "drizzle-orm/pg-core";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import { z } from "zod";
import { baseStatusColumns, baseDateColumns } from "./base.schema";
import { SystemMenuTypeEnum, SystemGenderEnum } from "../enum";

// const genderEnum = pgEnum('gender', SystemGenderEnum);

/** 用户表 */
export const systemUser = pgTable("system_user", {
  id: serial("id").primaryKey(),
  avatar: text("avatar"),
  username: text("user_name").notNull(),
  nickname: text("nick_name"),
  password: text("password").notNull(),
  phone: text("phone").unique(),
  email: text("email").unique(),
  gender: text("gender", { enum: SystemGenderEnum }),
  // gender: genderEnum('gender'),
  remark: text("remark"),

  ...baseStatusColumns,
  ...baseDateColumns,
});

/** 角色表 */
export const systemRole = pgTable("system_role", {
  id: serial("id").primaryKey(),
  roleName: text("role_name").notNull(),
  roleKey: text("role_key").notNull().unique(),
  remark: text("remark"),
  sort: integer("sort").notNull().default(0),
  ...baseStatusColumns,
});

/** 用户-角色表 */
export const systemUserToRole = pgTable(
  "system_user_to_role",
  {
    userId: integer("user_id")
      .notNull()
      .references(() => systemUser.id, {
        onUpdate: "cascade",
        onDelete: "cascade",
      }),
    roleId: integer("role_id")
      .notNull()
      .references(() => systemRole.id, {
        onUpdate: "cascade",
        onDelete: "cascade",
      }),
  },
  (t) => ({
    pk: primaryKey({ columns: [t.userId, t.roleId] }),
  })
);

/** 菜单表 */
export const systemMenu = pgTable("system_menu", {
  id: serial("id").primaryKey(),
  // parentId: integer('parent_id').default(0),
  // id自引用
  parentId: integer("parent_id").references((): AnyPgColumn => systemMenu.id),
  menuName: text("menu_name").notNull().unique(),
  menuType: text("menu_type", { enum: SystemMenuTypeEnum }).notNull(),
  menuIcon: text("menu_icon"),
  // 权限标识
  permissionKey: text("permission_key"),
  // 路由地址
  routerPath: text("router_path"),
  routerName: text("router_name"),
  // 组件地址
  componentPath: text("component_path"),
  // 重定向地址
  redirect: text("redirect"),
  // 是否缓存
  isKeepAlive: boolean("is_keep_alive"),
  // 是否在菜单显示
  isShow: boolean("is_show"),
  // 是否显示父级菜单
  isShowParent: boolean("is_show_parent"),
  sort: integer('sort').notNull().default(0),
  ...baseStatusColumns,
});

/** 菜单-角色表 */
export const systemMenuToRole = pgTable(
  "system_menu_to_role",
  {
    menuId: integer("menu_id")
      .notNull()
      .references(() => systemMenu.id, { onDelete: "cascade" }),
    roleId: integer("role_id")
      .notNull()
      .references(() => systemRole.id, { onDelete: "cascade" }),
  },
  (t) => ({
    pk: primaryKey({ columns: [t.menuId, t.roleId] }),
  })
);

/** 部门表 */
export const systemDept = pgTable('system_dept', {
  id: serial("id").primaryKey(),
  roleName: text("role_name").notNull(),
  roleKey: text("role_key").notNull().unique(),
  remark: text("remark"),
  sort: integer("sort").notNull().default(0),
  ...baseStatusColumns,
});

/** 类型 */
// 用户
export type InsertSystemUser = typeof systemUser.$inferInsert;
export type SelectSystemUser = typeof systemUser.$inferSelect;
export type SelectSystemUserResult = Omit<SelectSystemUser, "password">;
export const insertSystemUserSchema = createInsertSchema(systemUser);
export const selectSystemUserSchema = createSelectSchema(systemUser);
export const selectSystemUserResultSchema = selectSystemUserSchema.omit({
  password: true,
});

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

// 测试
// import { pgEnum } from 'drizzle-orm/pg-core';
// export const enableEnum = pgEnum('enable', ['NORMAL', 'DISABLE']);
// export const isStatus = pgEnum('roles', ['ADMIN', 'USER']);
