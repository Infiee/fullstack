export enum ErrorCode {
  /** 通用错误 */
  COMMON = '-1',
  FORBIDDEN = '4003',
  FORBIDDEN_ADMIN_USER_OPERATION = '4004',
  FORBIDDEN_ADMIN_ROLE_OPERATION = '4005',

  /** 用户相关 */
  LOGIN_EXPIRED = '1000',
  USER_DISABLED = '1001',
  USER_NOT_FOUND = '1002',
  USER_PASSWORD_ERROR = '1003',

  /** 验证码相关 */
  CAPTCHA_IN_VALID = '5001',
  CAPTCHA_ERROR = '5002',

  /** 权限相关 */
}

export const ErrorMessageMap = {
  /** 通用错误 */
  [ErrorCode.COMMON]: '业务异常',

  /** 用户相关 */
  [ErrorCode.LOGIN_EXPIRED]: '登录已过期',
  [ErrorCode.USER_DISABLED]: '用户已被禁用',
  [ErrorCode.USER_NOT_FOUND]: '用户不存在',
  [ErrorCode.USER_PASSWORD_ERROR]: '用户密码错误',

  /** 验证码相关 */
  [ErrorCode.CAPTCHA_IN_VALID]: '验证码无效',
  [ErrorCode.CAPTCHA_ERROR]: '验证码错误',

  // 权限相关
  [ErrorCode.FORBIDDEN]: '暂无访问无权限',
  [ErrorCode.FORBIDDEN_ADMIN_USER_OPERATION]: '不允许操作管理员用户',
  [ErrorCode.FORBIDDEN_ADMIN_ROLE_OPERATION]: '不允许操作管理员角色',
} as const;

export type ErrorMessageMapType = typeof ErrorMessageMap;
export type ErrorMessageKey = keyof ErrorMessageMapType;
