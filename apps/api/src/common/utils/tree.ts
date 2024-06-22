import { InsertSystemMenu } from '@repo/drizzle';
import { SystemRouterItem } from '@repo/contract';

export type Menu = InsertSystemMenu & {
  children?: SystemRouterItem['children'];
};

export function menuToTree(menus: Menu[]): SystemRouterItem[] {
  const rootItems: SystemRouterItem[] = [];
  const itemMap = new Map<number, SystemRouterItem>();

  for (const item of menus) {
    const newItem: SystemRouterItem & {
      children?: SystemRouterItem['children'];
    } = {
      path: item.path as string,
      name: item.name,
      component: item.component,
      meta: {
        title: item.title,
        icon: item.icon,
        rank: item.rank,
        showLink: item.showLink,
      },
      // children: [],
    };
    if (item.id) {
      itemMap.set(item.id, newItem);
    }
    if (!item.parentId) {
      rootItems.push(newItem);
    } else {
      const parentItem = itemMap.get(item.parentId);
      if (parentItem && item.menuType !== 3) {
        // 当node没有children的时候才生成
        if (!parentItem.children) {
          parentItem.children = [];
        }
        parentItem.children.push({
          ...newItem,
          meta: {
            title: newItem.meta?.title as string,
            icon: newItem.meta?.icon,
            // showLink: newItem.meta.showLink,
            // keepAlive: item.isKeepAlive,
            // showParent: true,
            // roles: ['test'],
          },
          // redirect: newItem.redirect,
        });
      }
    }
  }

  return rootItems;
}

// export type NodeItem = {
//   id: number;
//   label: string;
//   parentId: number;
// };

// export type TreeNode = NodeItem & {
//   children?: NodeItem[];
// };

/* export function arrayToTree(items: NodeItem[]): TreeNode[] {
  const rootItems: NodeItem[] = [];
  const itemMap = new Map<number, TreeNode>();
  for (const item of items) {
    // 每层node都有children
    const newItem = { ...item, children: [] };
    // const newItem = { ...item };

    itemMap.set(newItem.id, newItem);
    if (item.parentId === 0) {
      rootItems.push(newItem);
    } else {
      const parentItem = itemMap.get(item.parentId);
      if (parentItem) {
        // 当node没有children的时候才生成
        // if (!parentItem.children) {
        //   parentItem.children = [];
        // }
        parentItem.children.push(newItem);
      }
    }
  }
  return rootItems;
} */

// export function arrayToTree<T>(
//   items: T[],
//   option: {
//     parentIdKey: keyof T;
//     idKey: keyof T;
//     labelKey: keyof T;
//   },
// ): TreeNode[] {
//   const { idKey, parentIdKey, labelKey } = option;
//   const rootItems: TreeNode[] = [];
//   const itemMap = new Map<number, TreeNode>();

//   for (const item of items) {
//     const nodeItem: TreeNode = {
//       parentId: Number(item[parentIdKey]),
//       id: Number(item[idKey]),
//       label: item[labelKey].toString(),
//     };
//     const newItem = { ...nodeItem, children: [] };
//     itemMap.set(newItem.id, newItem);
//     if (item[parentIdKey] === 0) {
//       rootItems.push(newItem);
//     } else {
//       const parentItem = itemMap.get(Number(item[parentIdKey]));
//       if (parentItem) {
//         parentItem.children.push(newItem);
//       }
//     }
//   }

//   return rootItems;
// }

// export function menuToTree(menus: Menu[]) {
//   return arrayToTree(menus, {
//     parentIdKey: 'parentId',
//     idKey: 'id',
//     labelKey: 'menuName',
//   });
// }

// interface MenuNode {
//   id: number;
//   status: '0' | '1';
//   sort: number;
//   parentId: number;
//   menuName: string;
//   menuType: 'M' | 'D' | 'B';
//   menuIcon: string;
//   permissionKey: string;
//   routerPath: string;
//   componentPath: string;
//   componentName: string;
//   isKeepAlive: boolean;
//   isHidden: boolean;
//   children?: MenuNode[];
// }

// function convertToTree(
//   menus: {
//     id: number;
//     status: '0' | '1';
//     sort: number;
//     parentId: number;
//     menuName: string;
//     menuType: 'M' | 'D' | 'B';
//     menuIcon: string;
//     permissionKey: string;
//     routerPath: string;
//     componentPath: string;
//     componentName: string;
//     isKeepAlive: boolean;
//     isHidden: boolean;
//   }[],
// ): MenuNode[] {
//   const map: { [key: number]: MenuNode } = {};
//   const tree: MenuNode[] = [];

//   menus.forEach((menu) => {
//     map[menu.id] = { ...menu, children: [] };
//   });

//   menus.forEach((menu) => {
//     if (menu.parentId !== 0) {
//       map[menu.parentId].children.push(map[menu.id]);
//     } else {
//       tree.push(map[menu.id]);
//     }
//   });

//   return tree;
// }
