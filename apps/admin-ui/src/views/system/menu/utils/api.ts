import { client } from "@/utils/http/client";

export async function getMenuList() {
  const { body } = await client.systemMenu.getAll();
  return { data: body };
}
