# 开发步骤

```bash
# 安装依赖
pnpm i

# 编译packages，因为配置了dev或build里面的命令对编译后的包有依赖
pnpm compile:pkg

# 开始dev
pnpm dev
```

## 命令

```bash
nest new nest-api    

pnpm create vite admin-ui --template vue-ts

tsc init

pnpm --filter=nest-api  add nanoid@^3
```

## vite export模块示例

```json
{
  "name": "my-lib",
  "type": "module",
  "files": ["dist"],
  "main": "./dist/my-lib.cjs",
  "module": "./dist/my-lib.mjs",
  "exports": {
    ".": {
      "import": "./dist/my-lib.mjs",
      "require": "./dist/my-lib.cjs"
    },
    "./secondary": {
      "import": "./dist/secondary.mjs",
      "require": "./dist/secondary.cjs"
    }
  }
}
```

## 一个奇葩至极的BUG

`nest-api`内因为用不到`express`,所以把`express 和 @types/express`都移除了，结果`@ts-rest/nest`这个库`tsRestHandler`函数方法一直推断不出`body、query、params`之类的类型，排查了一天，反复的测试问题，发现只要移除了`@types/express`就会推断不出来类型！！！

`drizzle orm@0.32`版本也会出现异常，暂时降级`0.31.2`了。

