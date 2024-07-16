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
