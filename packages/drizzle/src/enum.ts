// export const SystemGenderEnum = ["M", "F"] as const;

/** 系统 - 状态 */
export enum SystemStatusEnum {
  /** 禁用 */
  DISABLED = 0,
  /** 启用 */
  ENABLED = 1,
}

/** 系统 - 性别 */
export enum SystemSexEnum {
  /** 男 */
  Male = 0,
  /** 女 */
  Female = 1,
}

/** 系统 - 菜单 */
export enum SystemMenuTypeEnum {
  /** 菜单 */
  MENU = 0,
  /** iframe */
  iframe = 1,
  /** 外链 */
  link = 2,
  /** 按钮 */
  BUTTON = 3,
}

/** 系统 - 部门类型 */
export enum SystemDepartmentTypeEnum {
  /** 公司 */
  COMPANY = 1,
  /** 分公司 */
  SUBCOMPANY = 2,
  /** 部门 */
  DEPARTMENT = 3,
}