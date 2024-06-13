import { relations } from 'drizzle-orm';
import {
  systemMenu,
  systemRole,
  systemUser,
  systemUserToRole,
  systemMenuToRole,
} from './system.schema';

// 关系 - 角色
export const systemRoleRelations = relations(systemRole, ({ many }) => ({
  systemUserToRole: many(systemUserToRole),
  systemMenuToRole: many(systemMenuToRole),
}));

// 关系 - 用户角色
export const systemUserRelations = relations(systemUser, ({ many }) => ({
  systemUserToRole: many(systemUserToRole),
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
  }),
);

// 关系 - 角色菜单
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
  }),
);
