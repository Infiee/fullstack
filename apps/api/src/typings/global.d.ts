declare global {
  // namespace NodeJS {
  // interface Env {}
  // interface ProcessEnv extends Env {}
  // }

  namespace JWT {
    interface Payload {
      username: string;
      id: number;
      /** 过期时间 */
      expireTime: number;
    }
    interface VerifyPayload extends Payload {
      iat: number;
      exp?: number;
    }
  }
}

// 如果你的模块没有导出任何内容，你将需要这一行。否则删除
export {};
