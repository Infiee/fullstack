import { AppConfigService } from '@/config/app-config.service';
import { RedisCacheService } from '@/shared/cache/redis-cache.service';
import { SharedService } from '@/shared/shared.service';
import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { FastifyRequest } from 'fastify';
// import { getClientIp } from '@supercharge/request-ip';

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
    if (!token) throw new ForbiddenException('未获取到accessToken,请先登录');

    const payload = await this.sharedService.validateToken(token);
    // TODO: 认证通过后挂载全局user对象到request
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { iat, exp, ...user } = payload;
    request.user = user;
    // 真实ip
    // request.realIp = getClientIp(request) as string;

    // await this.singleLogin(payload.id, token);
    return true;
  }

  // TODO: 单账号单端登录：校验Redis内 accessToken，防止拿到未过期的token 就认证通过了
  // async singleLogin(userId: number, token: string) {
  //   const accessToken = await this.redis.get<string>(
  //     `${ACCESS_TOKEN_KEY}:${userId}`,
  //   );
  //   // 当token过期或和传递过来的token不匹配的时候抛出错误
  //   if (!accessToken || token !== accessToken) {
  //     throw new UnauthorizedException('redis内accessToken校验失败,请重新登录');
  //   }
  // }
}
