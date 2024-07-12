import { relations } from "drizzle-orm";
import {
  sysMenu,
  sysRole,
  sysUser,
  sysUserToRole,
  sysMenuToRole,
  sysDept,
  sysDeptToRole,
} from "./sys.schema";

/** 关系 - 角色 */
export const sysRoleRelations = relations(sysRole, ({ many }) => ({
  sysUserToRole: many(sysUserToRole),
  sysMenuToRole: many(sysMenuToRole),
  sysDeptToRole: many(sysDeptToRole),
}));

/** 关系 - 用户 */
export const sysUserRelations = relations(sysUser, ({ many, one }) => ({
  sysUserToRole: many(sysUserToRole),
  dept: one(sysDept, {
    fields: [sysUser.deptId],
    references: [sysDept.id],
  }),
}));

/** 关系 - 用户 - 角色 */
export const sysUserToRoleRelations = relations(
  sysUserToRole,
  ({ one }) => ({
    sysRole: one(sysRole, {
      fields: [sysUserToRole.roleId],
      references: [sysRole.id],
    }),
    sysUser: one(sysUser, {
      fields: [sysUserToRole.userId],
      references: [sysUser.id],
    }),
  })
);

/** 关系 - 菜单 */
export const sysMenuRelations = relations(sysMenu, ({ many }) => ({
  sysMenuToRole: many(sysMenuToRole),
}));

/** 关系 - 菜单 - 角色*/
export const sysMenuToRoleRelations = relations(
  sysMenuToRole,
  ({ one }) => ({
    sysRole: one(sysRole, {
      fields: [sysMenuToRole.roleId],
      references: [sysRole.id],
    }),
    sysMenu: one(sysMenu, {
      fields: [sysMenuToRole.menuId],
      references: [sysMenu.id],
    }),
  })
);

/** 关系 - 部门 */
export const sysDeptRelations = relations(sysDept, ({ many }) => ({
  sysDeptToRole: many(sysDeptToRole),
  sysUsers: many(sysUser),
}));

/** 关系 - 部门 - 角色 */
export const sysDeptToRoleRelations = relations(
  sysDeptToRole,
  ({ one }) => ({
    sysRole: one(sysRole, {
      fields: [sysDeptToRole.roleId],
      references: [sysRole.id],
    }),
    sysDept: one(sysDept, {
      fields: [sysDeptToRole.deptId],
      references: [sysDept.id],
    }),
  })
);
