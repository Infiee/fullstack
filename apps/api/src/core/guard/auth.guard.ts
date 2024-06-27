import { ACCESS_TOKEN_KEY } from '@/common/constants/cache.constant';
import { ErrorCode } from '@/common/constants/err-code.constants';
import { AppConfigService } from '@/config/app-config.service';
import { RedisCacheService } from '@/shared/cache/redis-cache.service';
import { SharedService } from '@/shared/shared.service';
import {
  CanActivate,
  ExecutionContext,
  // HttpException,
  // HttpStatus,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { FastifyRequest } from 'fastify';
import { getClientIp } from '@supercharge/request-ip';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    private readonly sharedService: SharedService,
    private readonly config: AppConfigService,
    private readonly redis: RedisCacheService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest<FastifyRequest>();
    const token = this.sharedService.extractTokenFromHeader(request);
    if (!token) {
      throw new UnauthorizedException('未发现accessToken');
    }

    const payload = await this.sharedService.validateToken(token);
    // TODO: 认证通过后挂载全局user对象到request
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { iat, exp, ...user } = payload;
    request.user = user;
    // 真实ip
    request.realIp = getClientIp(request) as string;

    // TODO: 校验Redis内 accessToken，防止拿到未过期的token 就认证通过了
    const accessToken = await this.redis.get<string>(
      `${ACCESS_TOKEN_KEY}:${payload.id}`,
    );
    // 当token过期或和传递过来的token不匹配的时候抛出错误
    if (!accessToken || token !== accessToken) {
      throw new UnauthorizedException(
        {
          code: ErrorCode.LOGIN_EXPIRED,
          message: 'redis内accessToken校验失败,请重新登录',
        },
        //   HttpStatus.TOO_MANY_REQUESTS,
      );
    }
    return true;
  }
}
