#syntax=docker/dockerfile:1.7-labs
# 支持exclude语法
FROM node:20-alpine AS base

RUN npm i -g pnpm
RUN npm i -g turbo

# 构建阶段：用于安装依赖和构建项目
FROM base AS builder
# 设置工作目录
WORKDIR /app
# 复制所有文件到容器中
COPY . .
# 使用 turbo 进行修剪，只保留 api 相关的文件
RUN turbo prune nest-api --docker

# 安装阶段：安装依赖并构建项目
FROM base AS installer
WORKDIR /app
COPY --from=builder /app/out/json/ .
# 安装依赖，因为还包含了devDependencies，所以会比较大
RUN pnpm i
COPY --from=builder /app/out/full/ .
RUN turbo build --filter=nest-api...

# 运行阶段：设置最终的运行环境
FROM base AS runner
WORKDIR /app
COPY --exclude=**/node_modules --from=installer /app .
RUN pnpm i --prod
## 1.暂时不知道为啥这里不生效，换上面方法
# COPY --from=installer /app .
# RUN pnpm prune --prod
## 2.方法2
# RUN rm -rf ./node_modules && rm -rf ./**/*/node_modules
# RUN pnpm i --prod

# 拷贝部署
FROM base AS deploy
COPY --from=runner /app ./app

# 设置容器启动命令
CMD cd app/apps/nest-api && pnpm start:prod


# # 基础阶段：使用 Node.js 20 Alpine 镜像作为基础
# FROM node:20-alpine AS base
# # pnpm支持
# ENV PNPM_HOME="/pnpm"
# ENV PATH="$PNPM_HOME:$PATH"
# RUN corepack enable
# RUN pnpm add -g turbo
# # RUN apk update
# # RUN apk add --no-cache libc6-compat

# # 构建阶段：用于安装依赖和构建项目
# FROM base AS builder
# # 检查 https://github.com/nodejs/docker-node/tree/b4117f9333da4138b03a546ec926ef50a31506c3#nodealpine 以了解为什么可能需要 libc6-compat。
# # 更新包索引并安装 libc6-compat
# # RUN apk update && \
# #     apk add --no-cache libc6-compat
# # 设置工作目录
# WORKDIR /app
# # 全局安装 turbo
# # RUN pnpm add -g turbo
# # 复制所有文件到容器中
# COPY . .
# # 使用 turbo 进行修剪，只保留 api 相关的文件
# RUN turbo prune nest-api --docker

# # 安装阶段：安装依赖并构建项目
# FROM base AS installer
# # RUN apk update && \
# #     apk add --no-cache libc6-compat
# WORKDIR /app
# # 首先安装依赖（因为它们变化较少）
# COPY --from=builder /app/out/json/ .
# RUN pnpm i
# # 构建项目及其依赖
# COPY --from=builder /app/out/full/ .
# # 取消注释并使用构建参数来启用远程缓存
# # ARG TURBO_TEAM
# # ENV TURBO_TEAM=$TURBO_TEAM
# # ARG TURBO_TOKEN
# # ENV TURBO_TOKEN=$TURBO_TOKEN

# # 使用 turbo 构建 api 相关的项目
# # RUN pnpm add -g turbo
# RUN turbo build --filter=nest-api...

# # 运行阶段：设置最终的运行环境
# FROM base AS runner
# WORKDIR /app

# # 不要以 root 用户身份运行生产环境
# # RUN addgroup --system --gid 1001 nestjs
# # RUN adduser --system --uid 1001 nestjs
# # # 更改目录所有权
# # RUN chown -R nestjs:nestjs /app
# # USER nestjs

# # 从安装阶段复制构建好的文件
# COPY --from=installer /app .
# # RUN pnpm prune --prod
# # RUN rm -rf ./node_modules && rm -rf ./**/*/node_modules
# RUN pnpm i --prod

# # 设置容器启动命令
# CMD cd apps/nest-api && pnpm start:prod