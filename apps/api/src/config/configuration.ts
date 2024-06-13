import { z } from 'zod';

export const envConfigSchema = z.object({
  // 数据库
  DB_PG_URL: z.string(),

  // redis
  REDIS_HOST: z.string(),
  REDIS_PORT: z.coerce.number(),
  REDIS_PASSWORD: z.string(),
  REDIS_DB: z.coerce.number(),
  REDIS_TTL: z.coerce.number(),

  // jwt
  JWT_SECRET: z.string(),
  JWT_EXPIRESIN: z.string(),

  // 验证码
  CAPTCHA_EXPIRESIN: z.coerce.number(),

  // 管理员配置
  ADMIN_LIST: z.array(z.coerce.number()).default([1]),
});

export type EnvConfig = z.infer<typeof envConfigSchema>;

export const getEnvConfig = (env) => envConfigSchema.parse(env);
