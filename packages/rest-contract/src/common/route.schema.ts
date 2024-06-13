import { z } from "zod";

const RouteMetaSchema = z
  .object({
    title: z.string(),
    icon: z.string().nullable().optional(),
    extraIcon: z.string().nullable().optional(),
    showLink: z.boolean().nullable().optional(),
    showParent: z.boolean().nullable().optional(),
    roles: z.array(z.string()).nullable().optional(),
    auths: z.array(z.string()).nullable().optional(),
    keepAlive: z.boolean().nullable().optional(),
    frameSrc: z.string().nullable().optional(),
    frameLoading: z.boolean().nullable().optional(),
    transition: z
      .object({
        name: z.string().nullable().optional(),
        enterTransition: z.string().nullable().optional(),
        leaveTransition: z.string().nullable().optional(),
      })
      .nullable()
      .optional(),
    hiddenTag: z.boolean().nullable().optional(),
    fixedTag: z.boolean().nullable().optional(),
    dynamicLevel: z.number().nullable().optional(),
    activePath: z.string().nullable().optional(),
  })
  .strict();

const BaseSchema = z
  .object({
    path: z.string(),
    name: z.string().nullable().optional(),
    component: z.string().nullable().optional(),
    redirect: z.string().nullable().optional(),
    meta: RouteMetaSchema.nullable().optional(),
    // children: z.array(this).nullable().optional(),
  })
  .strict();

type Category = z.infer<typeof BaseSchema> & {
  children?: Category[];
};

const categorySchema: z.ZodType<Category> = BaseSchema.extend({
  children: z
    .lazy(() => categorySchema.array())
    .optional(),
});

export const SystemRouteSchema = z
  .object({
    path: z.string(),
    name: z.string().nullable().optional(),
    component: z.string().nullable().optional(),
    redirect: z.string().nullable().optional(),
    meta: z
      .object({
        title: z.string(),
        icon: z.string().nullable().optional(),
        showLink: z.boolean().nullable().optional(),
        rank: z.number().nullable().optional(),
      })
      .nullable()
      .optional(),
    children: categorySchema.array().optional(),
  })
  .strict();

// console.log(
//   "测试结果:",
//   RouteConfigsTableSchema.parse({
//     path: "/nested",
//     meta: {
//       title: "多级菜单",
//     },
//     children: [
//       {
//         path: "/nested/menu1",
//         meta: {
//           title: "菜单1",
//         },
//         children: [
//           {
//             path: "/nested/menu1/menu1-1/index",
//             name: "Menu1-1",
//             meta: {
//               title: "菜单1-1",
//               showParent: true,
//             },
//           },
//         ],
//       },
//     ],
//   })
// );

// interface RouteConfigsTable {
//   // 路由路径
//   path: string;
//   // 路由名称（必须保持唯一）
//   name: string;
//   // 路由重定向（默认跳转地址）
//   redirect: string;
//   // 路由元信息，通俗来说就是路由上的额外信息 https://router.vuejs.org/zh/guide/advanced/meta.html#%E8%B7%AF%E7%94%B1%E5%85%83%E4%BF%A1%E6%81%AF
//   meta: {
//     // 菜单名称（兼容国际化、非国际化，如果用国际化的写法就必须在根目录的locales文件夹下对应添加）
//     title: string;
//     // 菜单图标
//     icon: string | FunctionalComponent | IconifyIcon;
//     // 是否在菜单中显示
//     showLink: boolean;
//     // 菜单排序，值越高排的越后（只针对顶级路由）
//     rank: number;
//   };
//   // 子路由配置项
//   children: [
//     {
//       // 路由路径
//       path: string;
//       // 路由名称（必须唯一并且和当前路由component字段对应的页面里用defineOptions包起来的name保持一致）
//       name: string;
//       // 路由重定向
//       redirect: string;
//       // 按需加载需要展示的页面
//       component: RouteComponent;
//       // 路由元信息
//       meta: {
//         // 菜单名称（兼容国际化、非国际化，如果用国际化的写法就必须在根目录的locales文件夹下对应添加）
//         title: string;
//         // 菜单图标
//         icon: string | FunctionalComponent | IconifyIcon;
//         // 菜单名称右侧的额外图标
//         extraIcon: string | FunctionalComponent | IconifyIcon;
//         // 是否显示该菜单
//         showLink: boolean;
//         // 是否显示父级菜单
//         showParent: boolean;
//         // 页面级别权限设置
//         roles: Array<string>;
//         // 按钮级别权限设置
//         auths: Array<string>;
//         // 是否缓存该路由页面（开启后，会保存该页面的整体状态，刷新后会清空状态）
//         keepAlive: boolean;
//         // 需要内嵌的iframe链接地址
//         frameSrc: string;
//         // 内嵌的iframe页面是否开启首次加载动画
//         frameLoading: boolean;
//         // 页面加载动画（两种模式，第二种权重更高，第一种直接采用vue内置的transitions动画，第二种是使用animate.css编写进、离场动画，平台更推荐使用第二种模式，已经内置了animate.css，直接写对应的动画名即可）
//         transition: {
//           // 当前页面动画，这里是第一种模式，比如 name: "fade" 更具体看后面链接 https://cn.vuejs.org/api/built-in-components.html#transition
//           name: string;
//           // 当前页面进场动画，这里是第二种模式，比如 enterTransition: "animate__fadeInLeft"
//           enterTransition: string;
//           // 当前页面离场动画，这里是第二种模式，比如 leaveTransition: "animate__fadeOutRight"
//           leaveTransition: string;
//         };
//         // 当前菜单名称或自定义信息禁止添加到标签页
//         hiddenTag: boolean;
//         // 显示在标签页的最大数量，需满足后面的条件：不显示在菜单中的路由并且是通过query或params传参模式打开的页面。在完整版全局搜dynamicLevel即可查看代码演示
//         dynamicLevel: number;
//         // 将某个菜单激活（主要用于通过query或params传参的路由，当它们通过配置showLink: false后不在菜单中显示，就不会有任何菜单高亮，而通过设置activePath指定激活菜单即可获得高亮，activePath为指定激活菜单的path）
//         activePath: string;
//       };
//     },
//   ],
// };
