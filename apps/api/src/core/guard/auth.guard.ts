import {
  ACCESS_TOKEN_KEY,
  PERSIST_SYSTEM_JWT_PAYLOAD_KEY,
} from '@/common/constants/cache.constant';
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
// import { TsRestException } from '@ts-rest/nest';

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
      // throw new TsRestException(undefined as unknown as any, {
      //   status: 401,
      //   body: { message: '未发现accessToken' },
      // });
      throw new UnauthorizedException({
        message: '未发现accessToken',
      });
    }

    const payload = await this.sharedService.validateToken(token);
    // request['user'] = payload;

    // TODO: 校验Redis内 accessToken，防止拿到未过期的token 就认证通过了
    const accessToken = await this.redis.get<string>(
      `${ACCESS_TOKEN_KEY}:${payload.id}`,
    );
    // 当token过期或和传递过来的token不匹配的时候抛出错误
    if (!accessToken || token !== accessToken) {
      // throw new TsRestException(undefined as unknown as any, {
      //   status: 401,
      //   body: { message: 'redis内accessToken校验失败,请重新登录' },
      // });
      // throw new HttpException(
      //   { message: 'redis内accessToken校验失败,请重新登录' },
      //   HttpStatus.TOO_MANY_REQUESTS,
      // );
      throw new UnauthorizedException({
        code: ErrorCode.LOGIN_EXPIRED,
        message: 'redis内accessToken校验失败,请重新登录',
      });
    }
    // 设置payload
    await this.redis.persistSet(`${PERSIST_SYSTEM_JWT_PAYLOAD_KEY}`, payload);

    return true;
  }
}
