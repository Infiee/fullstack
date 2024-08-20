# 基础阶段：使用 Node.js 20 Alpine 镜像作为基础
FROM node:20-alpine AS base
# pnpm支持
ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"
RUN corepack enable
RUN pnpm add -g turbo

# 构建阶段：用于安装依赖和构建项目
FROM base AS builder
# 检查 https://github.com/nodejs/docker-node/tree/b4117f9333da4138b03a546ec926ef50a31506c3#nodealpine 以了解为什么可能需要 libc6-compat。
# 更新包索引并安装 libc6-compat
RUN apk update && \
    apk add --no-cache libc6-compat
# 设置工作目录
WORKDIR /app
# 全局安装 turbo
# RUN pnpm add -g turbo
# 复制所有文件到容器中
COPY . .
# 使用 turbo 进行修剪，只保留 api 相关的文件
RUN turbo prune nest-api --docker

# 安装阶段：安装依赖并构建项目
FROM base AS installer
RUN apk update && \
    apk add --no-cache libc6-compat
WORKDIR /app
# 首先安装依赖（因为它们变化较少）
COPY --from=builder /app/out/json/ .
RUN pnpm i --prod
# 构建项目及其依赖
COPY --from=builder /app/out/full/ .
# 取消注释并使用构建参数来启用远程缓存
# ARG TURBO_TEAM
# ENV TURBO_TEAM=$TURBO_TEAM
# ARG TURBO_TOKEN
# ENV TURBO_TOKEN=$TURBO_TOKEN

# 使用 turbo 构建 api 相关的项目
# RUN pnpm add -g turbo
RUN turbo build --filter=nest-api...

# 运行阶段：设置最终的运行环境
FROM base AS runner
WORKDIR /app

# 不要以 root 用户身份运行生产环境
RUN addgroup --system --gid 1001 nestjs
RUN adduser --system --uid 1001 nestjs
USER nestjs
# 从安装阶段复制构建好的文件
COPY --from=installer /app .

# 设置容器启动命令
CMD cd apps/nest-api && pnpm start:prod