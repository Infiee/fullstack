declare global {
  /** 扩展全局Node Env类型声明 */
  // namespace NodeJS {
  // interface Env {}
  // interface ProcessEnv extends Env {}
  // }

  /** 扩展全局JWT类型声明 */
  namespace JWT {
    interface Payload {
      uuid: string;
      id: number;
    }
    interface VerifyPayload extends Payload {
      iat: number;
      exp: number;
    }
  }
}

/** 给fastify 上的req扩展user对象声明 */
declare module 'fastify' {
  interface FastifyRequest {
    user?: JWT.Payload;
    realIp: string;
  }
}

/** 如果你的模块没有导出任何内容，你将需要这一行。否则删除 */
export {};
