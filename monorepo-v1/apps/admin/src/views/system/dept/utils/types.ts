interface FormItemProps {
  id?: number;
  higherDeptOptions: Record<string, unknown>[];
  parentId: number | null;
  name: string;
  principal: string;
  phone: string;
  email: string;
  sort: number;
  status: number;
  remark: string;
}
interface FormProps {
  formInline: FormItemProps;
}

export type { FormItemProps, FormProps };
