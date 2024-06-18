<script setup lang="ts">
import { ref } from "vue";
import { formRules } from "./utils/rule";
import { FormProps } from "./utils/types";

const props = withDefaults(defineProps<FormProps>(), {
  formInline: () => ({
    roleName: "",
    roleKey: "",
    remark: "",
    status: undefined
  })
});

const ruleFormRef = ref();
const newFormInline = ref(props.formInline);

function getRef() {
  return ruleFormRef.value;
}

defineExpose({ getRef });
</script>

<template>
  <el-form
    ref="ruleFormRef"
    :model="newFormInline"
    :rules="formRules"
    label-width="82px"
  >
    <el-form-item label="角色名称" prop="roleName">
      <el-input
        v-model="newFormInline.roleName"
        clearable
        placeholder="请输入角色名称"
      />
    </el-form-item>

    <el-form-item label="角色标识" prop="roleKey">
      <el-input
        v-model="newFormInline.roleKey"
        clearable
        placeholder="请输入角色标识"
      />
    </el-form-item>

    <el-form-item label="状态：" prop="status">
      <el-select
        v-model="newFormInline.status"
        placeholder="请选择状态"
        clearable
        class="!w-[180px]"
      >
        <el-option label="已启用" value="1" />
        <el-option label="已停用" value="0" />
      </el-select>
    </el-form-item>

    <el-form-item label="备注">
      <el-input
        v-model="newFormInline.remark"
        placeholder="请输入备注信息"
        type="textarea"
      />
    </el-form-item>
  </el-form>
</template>
