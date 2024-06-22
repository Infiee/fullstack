/**
 * TODO: 单token场景：自动续期token
 */
import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { FastifyRequest } from 'fastify';
import { SharedService } from '@/shared/shared.service';
// pnpm提示类型推断需要引入
import 'rxjs';

@Injectable()
export class RefreshTokenInterceptor implements NestInterceptor {
  constructor(private readonly sharedService: SharedService) {}

  async intercept(context: ExecutionContext, next: CallHandler) {
    const request = context.switchToHttp().getRequest<FastifyRequest>();

    // TODO: 拦截错误，不然会上报到全局错误拦截器，影响不需要验证授权的接口
    try {
      await this.sharedService.refreshToken(request);
    } catch (error) {}

    return next.handle();
  }
}
