import { InsertSystemMenu, SystemRouterItem } from '@repo/shared';

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
