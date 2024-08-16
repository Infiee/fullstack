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
import { baseStatusColumns, baseDateColumns } from "../../base.schema";

// const genderEnum = pgEnum('gender', SystemGenderEnum);

/** 用户表 */
export const systemUser = pgTable("system_user", {
  id: serial("id").primaryKey(),
  avatar: text("avatar"),
  username: text("username").notNull(),
  nickname: text("nickname"),
  password: text("password").notNull(),
  phone: text("phone").unique(),
  email: text("email").unique(),
  // gender: text("gender", { enum: SystemGenderEnum }),
  // gender: genderEnum('gender'),
  // sex: smallint("sex"),
  gender: smallint("gender"),
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
  extraIcon: text("extra_icon"),
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
  keepAlive: boolean("keep_alive"),
  // 是否在菜单显示
  showLink: boolean("show_link"),
  // 是否显示父级菜单
  showParent: boolean("show_parent"),
  // 固定标签页
  fixedTag: boolean("fixed_tag"),
  // 隐藏标签页
  hiddenTag: boolean("hidden_tag"),
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

