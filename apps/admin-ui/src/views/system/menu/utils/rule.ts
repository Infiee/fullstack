import { reactive } from "vue";
import type { FormRules } from "element-plus";

/** 自定义表单规则校验 */
export const formRules = reactive(<FormRules>{
  menuName: [{ required: true, message: "菜单名称为必填项", trigger: "blur" }],
  routerName: [
    { required: true, message: "路由名称为必填项", trigger: "blur" }
  ],
  routerPath: [
    { required: true, message: "路由路径为必填项", trigger: "blur" }
  ],
  permissionKey: [
    { required: true, message: "权限标识为必填项", trigger: "blur" }
  ]
});
