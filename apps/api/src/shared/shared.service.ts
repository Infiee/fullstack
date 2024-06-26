import { Injectable } from '@nestjs/common';
import uaParser from 'ua-parser-js';
import svgCaptcha from 'svg-captcha';
import { AppConfigService } from '@/config/app-config.service';
import { FastifyRequest } from 'fastify';
import { JwtService, JwtVerifyOptions } from '@nestjs/jwt';
import { RedisCacheService } from '@/shared/cache/redis-cache.service';
import { ACCESS_TOKEN_KEY } from '@/common/constants/cache.constant';
import ms from 'ms';

@Injectable()
export class SharedService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly config: AppConfigService,
    private readonly redis: RedisCacheService,
  ) {}
  /** 生成验证码 */
  async generateCaptcha() {
    const captcha = await svgCaptcha.createMathExpr({
      // size: 4,
      noise: 1,
      color: true,
      mathMax: 20,
      mathMin: 1,
      width: 100,
      height: 40,
      fontSize: 45,
    });
    return captcha;
  }

  /** 获取ua信息 */
  getUaInfo(ua: string) {
    const info = uaParser(ua);
    info.browser.name = info.browser.name || '未知';
    info.os.name = info.os.name || '未知';
    return info;
  }

  /** 是否管理员 */
  isAdmin(userId: number) {
    if (!userId) return false;
    const adminList = this.config.get('ADMIN_LIST');
    return Array.isArray(adminList) && adminList.includes(userId);
  }

  /** 从请求头获取token */
  extractTokenFromHeader(request: FastifyRequest): string | undefined {
    const [type, token] = request.headers.authorization?.split(' ') ?? [];
    return type === 'Bearer' ? token : undefined;
  }

  /** 校验token */
  async validateToken(token, options?: JwtVerifyOptions) {
    return this.jwtService.verify<JWT.VerifyPayload>(token, {
      secret: this.config.get('JWT_SECRET'),
      ...(options ? options : {}),
    });
  }

  /** 单token场景，刷新token */
  async refreshToken(request: FastifyRequest) {
    const token = this.extractTokenFromHeader(request);
    const payload = await this.validateToken(token);

    /** 计算过期剩余时间 */
    const currentTime = Math.floor(Date.now() / 1000);
    const remainingTime = payload.expireTime - currentTime;
    /** 30分钟内续期 */
    const threshold = 60 * 30;
    // const threshold = 60 * 60 * 24;

    // console.log('解密的payload', payload);

    // TODO: 如果token有效期小于5分钟则进行续期
    if (remainingTime < threshold) {
      await this.redis.set(
        `${ACCESS_TOKEN_KEY}:${payload.id}`,
        token,
        ms(this.config.get('JWT_EXPIRESIN')),
      );
    }
  }
}
