
interface FormItemProps {
  /** 角色名称 */
  roleName: string;
  /** 角色编号 */
  roleKey: string;
  /** 备注 */
  remark: string;
  /** 角色状态(0正常 1停用) */
  status: undefined;
}
interface FormProps {
  formInline: FormItemProps;
}

export type { FormItemProps, FormProps };
