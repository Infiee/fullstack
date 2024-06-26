import {
  AnyPgColumn,
  boolean,
  integer,
  pgTable,
  primaryKey,
  serial,
  smallint,
  text,
  timestamp,
} from "drizzle-orm/pg-core";
import "zod";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import { baseStatusColumns, baseDateColumns } from "./base.schema";

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
  // gender: text("gender", { enum: SystemGenderEnum }),
  // gender: genderEnum('gender'),
  sex: smallint("sex"),
  remark: text("remark"),

  deptId: integer("dept_id").references(() => systemDept.id),

  ...baseStatusColumns,
  ...baseDateColumns,
});

/** 角色表 */
export const systemRole = pgTable("system_role", {
  id: serial("id").primaryKey(),
  // 角色名称
  name: text("name").notNull(),
  // 角色标识
  code: text("code").notNull().unique(),
  remark: text("remark"),
  sort: integer("sort").notNull().default(0),
  ...baseStatusColumns,
});

/** 菜单表 */
export const systemMenu = pgTable("system_menu", {
  id: serial("id").primaryKey(),
  // parentId: integer('parent_id').default(0),
  // id自引用
  parentId: integer("parent_id").references((): AnyPgColumn => systemMenu.id),
  title: text("title").notNull().unique(),
  // menuType: text("menu_type", { enum: SystemMenuTypeEnum }).notNull(),
  // 菜单类型（0代表菜单、1代表iframe、2代表外链、3代表按钮）
  menuType: smallint("menu_type").notNull(),
  // 权限标识
  auths: text("permission_key"),
  // 路由地址
  path: text("path"),
  // 路由名
  name: text("name"),
  // 组件地址
  component: text("component"),
  // 菜单icon
  icon: text("icon"),
  // 菜单右侧icon
  extraIcon: text("extra-icon"),
  // 重定向地址
  redirect: text("redirect"),
  // 进场动画
  enterTransition: text("enter_transition"),
  // 出场动画
  leaveTransition: text("leave_transition"),
  // 激活的菜单路径
  activePath: text("active_path"),
  // 外链地址
  frameSrc: text("frame_src"),
  // 外链动画
  frameLoading: boolean("frame_loading"),
  // 是否缓存
  keepAlive: boolean("keepAlive"),
  // 是否在菜单显示
  showLink: boolean("showLink"),
  // 是否显示父级菜单
  showParent: boolean("showParent"),
  // 固定标签页
  fixedTag: boolean("fixedTag"),
  // 隐藏标签页
  hiddenTag: boolean("hiddenTag"),
  // 排序
  rank: integer("rank").notNull().default(0),
});

/** 部门表 */
export const systemDept = pgTable("system_dept", {
  id: serial("id").primaryKey(),
  parentId: integer("parent_id").references((): AnyPgColumn => systemDept.id),
  name: text("name").notNull(),
  phone: text("phone"),
  principal: text("principal"),
  email: text("email"),
  remark: text("remark"),
  sort: smallint("sort").notNull().default(0),
  // type: smallint("type").notNull(),
  type: smallint("type"),
  ...baseDateColumns,
  ...baseStatusColumns,
});

/** 登录日志表 */
export const systemLoginLog = pgTable("system_login_log", {
  id: serial("id").primaryKey(),
  username: text("user_name").notNull(),
  ip: text("ip"),
  address: text("address"),
  system: text("system"),
  browser: text("browser"),
  behavior: text("behavior"),
  status: smallint("status").notNull(),
  loginTime: timestamp("login_time", { precision: 3 }).notNull().defaultNow(),
});

/* --------------------- 关联表 --------------------------- */
/** 用户 - 角色表 */
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

/** 菜单 - 角色表 */
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

/** 部门 - 角色表 */
export const systemDeptToRole = pgTable(
  "system_dept_to_role",
  {
    deptId: integer("dept_id")
      .notNull()
      .references(() => systemDept.id, { onDelete: "cascade" }),
    roleId: integer("role_id")
      .notNull()
      .references(() => systemRole.id, { onDelete: "cascade" }),
  },
  (t) => ({
    pk: primaryKey({ columns: [t.deptId, t.roleId] }),
  })
);

/* --------------------- 类型 --------------------------- */
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
