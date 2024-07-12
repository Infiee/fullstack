import { relations } from "drizzle-orm";
import {
  systemMenu,
  systemRole,
  systemUser,
  systemUserToRole,
  systemMenuToRole,
  systemDept,
  systemDeptToRole,
} from "./system.schema";

/** 关系 - 角色 */
export const systemRoleRelations = relations(systemRole, ({ many }) => ({
  systemUserToRole: many(systemUserToRole),
  systemMenuToRole: many(systemMenuToRole),
  systemDeptToRole: many(systemDeptToRole),
}));

/** 关系 - 用户 - 角色 */
export const systemUserRelations = relations(systemUser, ({ many, one }) => ({
  systemUserToRole: many(systemUserToRole),
  dept: one(systemDept, {
    fields: [systemUser.deptId],
    references: [systemDept.id],
  }),
}));
export const systemUserToRoleRelations = relations(
  systemUserToRole,
  ({ one }) => ({
    systemRole: one(systemRole, {
      fields: [systemUserToRole.roleId],
      references: [systemRole.id],
    }),
    systemUser: one(systemUser, {
      fields: [systemUserToRole.userId],
      references: [systemUser.id],
    }),
  })
);

/** 关系 - 角色 - 菜单 */
export const systemMenuRelations = relations(systemMenu, ({ many }) => ({
  systemMenuToRole: many(systemMenuToRole),
}));
export const systemMenuToRoleRelations = relations(
  systemMenuToRole,
  ({ one }) => ({
    systemRole: one(systemRole, {
      fields: [systemMenuToRole.roleId],
      references: [systemRole.id],
    }),
    systemMenu: one(systemMenu, {
      fields: [systemMenuToRole.menuId],
      references: [systemMenu.id],
    }),
  })
);

/** 关系 - 角色 - 部门 */
export const systemDeptRelations = relations(systemDept, ({ many }) => ({
  systemDeptToRole: many(systemDeptToRole),
  systemUsers: many(systemUser)
}));
export const systemDeptToRoleRelations = relations(
  systemDeptToRole,
  ({ one }) => ({
    systemRole: one(systemRole, {
      fields: [systemDeptToRole.roleId],
      references: [systemRole.id],
    }),
    systemDept: one(systemDept, {
      fields: [systemDeptToRole.deptId],
      references: [systemDept.id],
    }),
  })
);
