admin 运行提示 vite load html aws什么的，大概率是bcrypt导致的，移除扩展包内的bcrypt即可


## 功能优化

1. 合约只处理正确的返回状态，不然在客户端使用会很繁琐，需要一直判断status

改造成在业务校验失败的场景服务端在抛出全局异常，客户端再通用请求方法处理通用异常即可。

<!-- 未改造之前 -->
```typescript
// 合约
login: {
  method: "POST",
  path: "/login",
  body: SystemLoginSchema,
  responses: {
    200: z.object({ accessToken: z.string() }),
    400: z.object({
      code: z.coerce.number().default(-1),
      message: z.string(),
    }),
  },
  metadata,
  summary: "登录",
}

// 客户端使用
export const getUserList = async (
  params?: ClientInferRequest<typeof contract.systemUser.getAll>["query"]
) => {
  const { body, status } = await client.systemUser.getAll({
    query: params
  });
  if (status !== 200) return;
  return { data: body };
};
```

## zod移除多余属性和为空的属性

```ts
import { insertSystemMenuSchema } from "@repo/drizzle";

const row = {
  menuType: 0,
  higherMenuOptions: {},
  parentId: null,
  title: "",
  name: "",
  path: "",
  component: "",
  rank: 99,
  redirect: "",
  icon: "",
  extraIcon: "",
  enterTransition: "",
  leaveTransition: "",
  activePath: "",
  auths: "",
  frameSrc: "",
  frameLoading: true,
  keepAlive: false,
  hiddenTag: false,
  fixedTag: false,
  showLink: true,
  showParent: false
  };
  const removeEmpty = (obj: Record<string, any>): Record<string, any> => {
    return Object.fromEntries(
      Object.entries(obj).filter(([_, v]) => v != null && v !== "")
    );
  };

  console.log(insertSystemMenuSchema.strip().transform(removeEmpty).parse(row));
```
