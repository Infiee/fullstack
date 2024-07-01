/**
 * 用户相关:
 * PERSIST是持久化缓存前缀，缓存无期限
 */
/** 访问token */
export const ACCESS_TOKEN_KEY = 'system:access-token';
/** 刷新token */
export const REFRESH_TOKEN_KEY = 'system:refresh-token';

/** 持久化用户信息 */
export const PERSIST_SYSTEM_USER_KEY = 'system:user';
// export const PERSIST_SYSTEM_USER_PERMISSIONS_KEY = 'system:permissions';
// export const PERSIST_SYSTEM_USER_ROLES_KEY = 'system:rolesKey';
// export const PERSIST_SYSTEM_USER_ROLES_LIST_KEY = 'system:rolesList';
// export const PERSIST_SYSTEM_USER_MENUS_KEY = 'system:menus';
// export const PERSIST_SYSTEM_USER_DEPARTMENTS_KEY = 'system:departments';

/** 重复提交 */
export const REPEAT_SUBMIT_KEY = 'repeat-submit';

/** 验证码 */
export const CAPTCHA_IMAGE_KEY = 'captcha:img';
