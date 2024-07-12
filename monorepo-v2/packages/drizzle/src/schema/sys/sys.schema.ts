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
import { baseStatusColumns, baseDateColumns } from "../base.schema";

// const genderEnum = pgEnum('gender', SysGenderEnum);

/** 用户表 */
export const sysUser = pgTable("sys_user", {
  id: serial("id").primaryKey(),
  avatar: text("avatar"),
  username: text("user_name").notNull(),
  nickname: text("nick_name"),
  password: text("password").notNull(),
  phone: text("phone").unique(),
  email: text("email").unique(),
  // gender: text("gender", { enum: SysGenderEnum }),
  // gender: genderEnum('gender'),
  sex: smallint("sex"),
  remark: text("remark"),

  deptId: integer("dept_id").references(() => sysDept.id),

  ...baseStatusColumns,
  ...baseDateColumns,
});

/** 角色表 */
export const sysRole = pgTable("sys_role", {
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
export const sysMenu = pgTable("sys_menu", {
  id: serial("id").primaryKey(),
  // parentId: integer('parent_id').default(0),
  // id自引用
  parentId: integer("parent_id").references((): AnyPgColumn => sysMenu.id),
  title: text("title").notNull().unique(),
  // menuType: text("menu_type", { enum: SysMenuTypeEnum }).notNull(),
  // 菜单类型（0代表菜单、1代表iframe、2代表外链、3代表按钮）
  menuType: smallint("menu_type").notNull(),
  // 权限标识
  auths: text("auths"),
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
export const sysDept = pgTable("sys_dept", {
  id: serial("id").primaryKey(),
  parentId: integer("parent_id").references((): AnyPgColumn => sysDept.id),
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
export const sysLoginLog = pgTable("sys_login_log", {
  id: serial("id").primaryKey(),
  username: text("user_name").notNull(),
  ip: text("ip"),
  address: text("address"),
  sys: text("sys"),
  browser: text("browser"),
  behavior: text("behavior"),
  status: smallint("status").notNull(),
  loginTime: timestamp("login_time", { precision: 3 }).notNull().defaultNow(),
});

/* --------------------- 关联表 --------------------------- */
/** 用户 - 角色表 */
export const sysUserToRole = pgTable(
  "sys_user_to_role",
  {
    userId: integer("user_id")
      .notNull()
      .references(() => sysUser.id, {
        onUpdate: "cascade",
        onDelete: "cascade",
      }),
    roleId: integer("role_id")
      .notNull()
      .references(() => sysRole.id, {
        onUpdate: "cascade",
        onDelete: "cascade",
      }),
  },
  (t) => ({
    pk: primaryKey({ columns: [t.userId, t.roleId] }),
  })
);

/** 菜单 - 角色表 */
export const sysMenuToRole = pgTable(
  "sys_menu_to_role",
  {
    menuId: integer("menu_id")
      .notNull()
      .references(() => sysMenu.id, { onDelete: "cascade" }),
    roleId: integer("role_id")
      .notNull()
      .references(() => sysRole.id, { onDelete: "cascade" }),
  },
  (t) => ({
    pk: primaryKey({ columns: [t.menuId, t.roleId] }),
  })
);

/** 部门 - 角色表 */
export const sysDeptToRole = pgTable(
  "sys_dept_to_role",
  {
    deptId: integer("dept_id")
      .notNull()
      .references(() => sysDept.id, { onDelete: "cascade" }),
    roleId: integer("role_id")
      .notNull()
      .references(() => sysRole.id, { onDelete: "cascade" }),
  },
  (t) => ({
    pk: primaryKey({ columns: [t.deptId, t.roleId] }),
  })
);

/* --------------------- 类型 --------------------------- */
// 用户
export type InsertSysUser = typeof sysUser.$inferInsert;
export type SelectSysUser = typeof sysUser.$inferSelect;
export type SelectSysUserResult = Omit<SelectSysUser, "password">;
export const insertSysUserSchema = createInsertSchema(sysUser);
export const selectSysUserSchema = createSelectSchema(sysUser);
export const selectSysUserResultSchema = selectSysUserSchema.omit({
  password: true,
});

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
