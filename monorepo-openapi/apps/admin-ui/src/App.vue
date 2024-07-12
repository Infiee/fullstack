<script setup lang="ts">
import createClient from "openapi-fetch";

import { components, paths } from "@shared/openapi";
import { onMounted, ref } from "vue";

type SysUser = components["schemas"]["SysUser"];
const user = ref({} as SysUser);
const client = createClient<paths>({ baseUrl: "http://localhost:3000" });
onMounted(async () => {
  const { data } = await client.GET("/sys/user/{id}", {
    params: { path: { id: "1" } },
  });
  console.log("user.value-", data);
  if (!data?.data) return;
  user.value = data?.data;
});
</script>

<template>
  <div>user:</div>
  <pre>{{ JSON.stringify(user, null, 2) }}</pre>
</template>

<style scoped>
</style>
