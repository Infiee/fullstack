import editForm from "../form.vue";
import { handleTree } from "@/utils/tree";
import { message } from "@/utils/message";
import { getMenuList } from "./api";
import { addDialog } from "@/components/ReDialog";
import { reactive, ref, onMounted, h } from "vue";
import type { FormItemProps } from "../utils/types";
import { useRenderIcon } from "@/components/ReIcon/src/hooks";
import { cloneDeep, isAllEmpty, deviceDetection } from "@pureadmin/utils";
import type { SelectSystemMenu } from "@repo/drizzle";

export function useMenu() {
  const form = reactive({
    menuName: ""
  });

  const formRef = ref();
  const dataList = ref([]);
  const loading = ref(true);

  // const getMenuType = (type, text = false) => {
  //   switch (type) {
  //     case 0:
  //       return text ? "菜单" : "primary";
  //     case 1:
  //       return text ? "iframe" : "warning";
  //     case 2:
  //       return text ? "外链" : "danger";
  //     case 3:
  //       return text ? "按钮" : "info";
  //   }
  // };

  const getMenuType = (type, text = false) => {
    switch (type) {
      case "D":
        return text ? "目录" : "warning";
      case "M":
        return text ? "菜单" : "primary";
      case "B":
        return text ? "按钮" : "info";
      default:
        return text ? "按钮" : "danger";
    }
  };

  const columns: TableColumnList = [
    {
      label: "菜单名称",
      prop: "menuName",
      align: "left",
      cellRenderer: ({ row }) => (
        <>
          <span class="inline-block mr-1">
            {h(useRenderIcon(row.icon), {
              style: { paddingTop: "1px" }
            })}
          </span>
          <span>{row.menuName}</span>
        </>
      )
    },
    {
      label: "菜单类型",
      prop: "menuType",
      width: 100,
      cellRenderer: ({ row, props }) => (
        <el-tag
          size={props.size}
          type={getMenuType(row.menuType)}
          effect="plain"
        >
          {getMenuType(row.menuType, true)}
        </el-tag>
      )
    },
    {
      label: "路由路径",
      prop: "routerPath"
    },
    {
      label: "组件路径",
      prop: "componentPath",
      formatter: ({ routerPath, component }) =>
        isAllEmpty(component) ? routerPath : component
    },
    {
      label: "权限标识",
      prop: "permissionKey"
    },
    {
      label: "排序",
      prop: "sort",
      width: 100
    },
    {
      label: "显示",
      prop: "isShow",
      cellRenderer: ({ row, props }) => (
        <el-tag
          size={props.size}
          type={row.isShow ? "primary" : "danger"}
          effect="plain"
        >
          {row.isShow ? "是" : "否"}
        </el-tag>
      ),
      width: 100
    },
    {
      label: "操作",
      fixed: "right",
      width: 210,
      slot: "operation"
    }
  ];

  function handleSelectionChange(val) {
    console.log("handleSelectionChange", val);
  }

  function resetForm(formEl) {
    if (!formEl) return;
    formEl.resetFields();
    onSearch();
  }

  async function onSearch() {
    loading.value = true;
    const { data } = await getMenuList(); // 这里是返回一维数组结构，前端自行处理成树结构，返回格式要求：唯一id加父节点parentId，parentId取父节点id
    let newData = data;
    if (!isAllEmpty(form.menuName)) {
      // 前端搜索菜单名称
      newData = newData.filter(item => item.menuName.includes(form.menuName));
    }
    dataList.value = handleTree(newData); // 处理成树结构
    setTimeout(() => {
      loading.value = false;
    }, 500);
  }

  function formatHigherMenuOptions(treeList) {
    if (!treeList || !treeList.length) return;
    const newTreeList = [];
    for (let i = 0; i < treeList.length; i++) {
      treeList[i].menuName = treeList[i].menuName;
      formatHigherMenuOptions(treeList[i].children);
      newTreeList.push(treeList[i]);
    }
    return newTreeList;
  }

  function openDialog(title = "新增", row?: SelectSystemMenu) {
    addDialog({
      title: `${title}菜单`,
      props: {
        formInline: {
          menuType: row?.menuType ?? undefined,
          higherMenuOptions: formatHigherMenuOptions(cloneDeep(dataList.value)),
          parentId: row?.parentId ?? 0,
          menuName: row?.menuName ?? "",
          routerName: row?.routerName ?? "",
          routerPath: row?.routerPath ?? "",
          componentPath: row?.componentPath ?? "",
          sort: row?.sort ?? 99,
          redirect: row?.redirect ?? "",
          // icon: row?.icon ?? "",
          // extraIcon: row?.extraIcon ?? "",
          // enterTransition: row?.enterTransition ?? "",
          // leaveTransition: row?.leaveTransition ?? "",
          // activePath: row?.activePath ?? "",
          // permissionKey: row?.permissionKey ?? "",
          // frameSrc: row?.frameSrc ?? "",
          // frameLoading: row?.frameLoading ?? true,
          keepAlive: row?.isKeepAlive ?? false,
          // hiddenTag: row?.hiddenTag ?? false,
          // fixedTag: row?.fixedTag ?? false,
          isShow: row?.isShow ?? true,
          isShowParent: row?.isShowParent ?? false
        }
      },
      width: "45%",
      draggable: true,
      fullscreen: deviceDetection(),
      fullscreenIcon: true,
      closeOnClickModal: false,
      contentRenderer: () => h(editForm, { ref: formRef }),
      beforeSure: (done, { options }) => {
        const FormRef = formRef.value.getRef();
        const curData = options.props.formInline as FormItemProps;
        function chores() {
          message(`您${title}了菜单名称为${curData.menuName}的这条数据`, {
            type: "success"
          });
          done(); // 关闭弹框
          onSearch(); // 刷新表格数据
        }
        FormRef.validate(valid => {
          if (valid) {
            console.log("curData", curData);
            // 表单规则校验通过
            if (title === "新增") {
              // 实际开发先调用新增接口，再进行下面操作
              chores();
            } else {
              // 实际开发先调用修改接口，再进行下面操作
              chores();
            }
          }
        });
      }
    });
  }

  function handleDelete(row) {
    message(`您删除了菜单名称为${row.menuName}的这条数据`, {
      type: "success"
    });
    onSearch();
  }

  onMounted(() => {
    onSearch();
  });

  return {
    form,
    loading,
    columns,
    dataList,
    /** 搜索 */
    onSearch,
    /** 重置 */
    resetForm,
    /** 新增、修改菜单 */
    openDialog,
    /** 删除菜单 */
    handleDelete,
    handleSelectionChange
  };
}
