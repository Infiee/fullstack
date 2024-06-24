import { eq, inArray, sql } from "drizzle-orm";
import { NodePgDatabase } from "drizzle-orm/node-postgres";

import * as schema from "../src/schema";
import {
  Dept,
  Menu,
  deptData,
  menuData,
  roleData,
  userData,
} from "./mock/data";
import { getDb } from "./db";
import { hashPassword } from "./utils";

type DB = NodePgDatabase<typeof schema>;

(async () => {
  const { db, client } = await getDb();

  // 执行
  seedData();

  async function seedData() {
    try {
      // 重建public
      // await db.execute(
      //   sql`DROP SCHEMA public CASCADE;CREATE SCHEMA public;GRANT ALL ON SCHEMA public TO public;GRANT ALL ON SCHEMA public TO postgres;`,
      // );

      // await db.execute(sql`DROP TABLE IF EXISTS SystemMenu,SystemUser;`);

      await db.transaction(async (tx) => {
        // await createMenu(tx);
        // await createUser(tx);
        // await createRole(tx);
        // await createUserRole(tx);
        // await createRoleMenu(tx);

        await createDept(tx);
      });

      await client.end();
      console.log("seed成功");
    } catch (error) {
      console.log("seed失败:" + error);
      process.exit(1);
    }
  }
})();

// 用户
async function createUser(db: DB) {
  const data = await Promise.all(
    userData.map(async (user) => {
      user.password = await hashPassword(user.password);
      return user;
    })
  );
  await db.insert(schema.systemUser).values(data).returning();
  console.log("用户数据：创建成功");
}

// 角色
async function createRole(db: DB) {
  await db.insert(schema.systemRole).values(roleData).returning();
  console.log("角色数据：创建成功");
}

// 菜单
async function createMenu(db: DB) {
  const mapItem = async (item: Menu, parentId?: number) => {
    const { children, ...params } = item;
    const itemData = await db
      .insert(schema.systemMenu)
      .values({
        ...params,
        ...(parentId ? { parentId } : {}),
      })
      .returning();
    if (item.children && item.children.length > 0) {
      for (const children of item.children) {
        await mapItem(children, itemData[0].id);
      }
    }
  };
  for (const item of menuData) {
    await mapItem(item);
  }
  console.log("菜单数据：创建成功");
}

// 用户 -> 角色
async function createUserRole(db: DB) {
  const relations = [
    {
      userId: 1,
      roleId: 1,
    },
    {
      userId: 5,
      roleId: 3,
    },
  ];
  await db.delete(schema.systemUserToRole).where(
    inArray(
      schema.systemUserToRole.userId,
      relations.map((r) => r.userId)
    )
  );
  if (relations.length > 0) {
    await db.insert(schema.systemUserToRole).values(relations).returning();
  }
  console.log("用户->角色数据：创建成功");
}
// 角色 -> 菜单
async function createRoleMenu(db: NodePgDatabase<typeof schema>) {
  const menuIds = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
  const roleIds = [3];
  const relations = menuIds.map((menuId) => ({ menuId, roleId: roleIds[0] }));
  await db
    .delete(schema.systemMenuToRole)
    .where(inArray(schema.systemMenuToRole.roleId, roleIds));
  await db.insert(schema.systemMenuToRole).values(relations).returning();
  console.log("角色->菜单数据：创建成功");
}

// 部门
async function createDept(db: DB) {
  const mapItem = async (item: Dept, parentId?: number) => {
    const { children, ...params } = item;
    const itemData = await db
      .insert(schema.systemDept)
      .values({
        ...params,
        ...(parentId ? { parentId } : {}),
      })
      .returning();
    if (item.children && item.children.length > 0) {
      for (const children of item.children) {
        await mapItem(children, itemData[0].id);
      }
    }
  };
  for (const item of deptData) {
    await mapItem(item);
  }
  console.log("部门数据：创建成功");
}
