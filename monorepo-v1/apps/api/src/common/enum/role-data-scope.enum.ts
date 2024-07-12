export enum RoleDataScopeEnum {
  /**全部数据权限 */
  ALL = '1',

  /**自定数据权限 */
  CUSTOM = '2',

  /**部门数据权限 */
  DEPT = '3',

  /**部门及以下数据权限 */
  DEPT_AND_CHILD = '4',

  /**仅本人数据权限 */
  SELF = '5',
}

/**系统角色-数据范围 */
export const ROLE_DATA_SCOPE: Record<string, string> = {
  '1': '全部数据权限',
  '2': '自定数据权限',
  '3': '部门数据权限',
  '4': '部门及以下数据权限',
  '5': '仅本人数据权限',
};
