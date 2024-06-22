export enum SystemPermission {
  // 用户管理
  /** @description 用户视图 */
  SYSTEM_USER_VIEW = 'system:user:view',
  /** @description 用户查询 */
  SYSTEM_USER_QUERY = 'system:user:query',
  SYSTEM_USER_CREATE = 'system:user:create',
  SYSTEM_USER_UPDATE = 'system:user:update',
  SYSTEM_USER_DELETE = 'system:user:delete',
  SYSTEM_USER_RESET_PASSWORD = 'system:user:reset-password',

  // 角色管理
  SYSTEM_ROLE_VIEW = 'system:role:view',
  SYSTEM_ROLE_QUERY = 'system:role:query',
  SYSTEM_ROLE_CREATE = 'system:role:create',
  SYSTEM_ROLE_UPDATE = 'system:role:update',
  SYSTEM_ROLE_DELETE = 'system:role:delete',
  SYSTEM_ROLE_MENU = 'system:permission:role-menu',
  SYSTEM_ROLE_DATA_SCOPE = 'system:permission:role-data-scope',
  SYSTEM_ROLE_USER = 'system:permission:role-user',

  // 菜单管理
  SYSTEM_MENU_VIEW = 'system:menu:view',
  SYSTEM_MENU_QUERY = 'system:menu:query',
  SYSTEM_MENU_CREATE = 'system:menu:create',
  SYSTEM_MENU_UPDATE = 'system:menu:update',
  SYSTEM_MENU_DELETE = 'system:menu:delete',

  // 部门管理
  SYSTEM_DEPARTMENT_VIEW = 'system:department:view',
  SYSTEM_DEPARTMENT_QUERY = 'system:department:query',
  SYSTEM_DEPARTMENT_CREATE = 'system:department:create',
  SYSTEM_DEPARTMENT_UPDATE = 'system:department:update',
  SYSTEM_DEPARTMENT_DELETE = 'system:department:delete',

  // 岗位管理
  SYSTEM_POST_VIEW = 'system:post:view',
  SYSTEM_POST_QUERY = 'system:post:query',
  SYSTEM_POST_CREATE = 'system:post:create',
  SYSTEM_POST_UPDATE = 'system:post:update',
  SYSTEM_POST_DELETE = 'system:post:delete',
}

export type SystemPermissionKey = keyof typeof SystemPermission;
