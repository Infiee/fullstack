import { SelectSystemUser } from "@repo/drizzle";

interface FormItemProps extends SelectSystemUser{
  /** 用于判断是`新增`还是`修改` */
  title: string;
  higherDeptOptions: Record<string, unknown>[];
  parentId?: number;
  dept?: {
    id?: number;
    name?: string;
  };
}
interface FormProps {
  formInline: FormItemProps;
}

interface RoleFormItemProps {
  // username: string;
  nickname: string;
  /** 角色列表 */
  roleOptions: any[];
  /** 选中的角色列表 */
  ids: number[];
}
interface RoleFormProps {
  formInline: RoleFormItemProps;
}

export type { FormItemProps, FormProps, RoleFormItemProps, RoleFormProps };
