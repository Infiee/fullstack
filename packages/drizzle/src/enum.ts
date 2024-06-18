/** 通用状态（禁用 - 0、启用 - 1） */
export const SystemStatusEnum = ["0", "1"] as const;
/** 菜单（目录 - D、菜单 - M、按钮 - B） */
export const SystemMenuTypeEnum = ["D", "M", "B"] as const;
/** 性别（男 - M、女 - F） */
export const SystemGenderEnum = ["M", "F"] as const;

/** 系统状态枚举 */
export enum SystemStatus {
  /** 禁用 */
  DISABLED = '0',
  /** 启用 */
  ENABLED = '1'
}