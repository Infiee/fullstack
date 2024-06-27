import { Controller, Request, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { TsRestHandler, tsRestHandler } from '@ts-rest/nest';
import { contract } from '@repo/contract';
import { AuthGuard } from '@/core/guard/auth.guard';
import { ApiResult } from '@/common/utils/api-result';
import { FastifyRequest } from 'fastify';

@Controller()
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @TsRestHandler(contract.systemAuth.getCaptchaImage)
  generateCaptcha() {
    return tsRestHandler(contract.systemAuth.getCaptchaImage, async () => {
      const data = await this.authService.generateCaptcha();
      return { status: 200, body: ApiResult.ok(data) };
    });
  }

  @TsRestHandler(contract.systemAuth.login)
  login() {
    return tsRestHandler(contract.systemAuth.login, async ({ body }) => {
      const data = await this.authService.login(body);
      return { status: 200, body: ApiResult.ok(data) };
    });
  }

  @UseGuards(AuthGuard)
  @TsRestHandler(contract.systemAuth.getInfo)
  getInfo(@Request() req: FastifyRequest) {
    return tsRestHandler(contract.systemAuth.getInfo, async () => {
      const data = await this.authService.getInfo(req);
      return { status: 200, body: ApiResult.ok(data) };
    });
  }

  @UseGuards(AuthGuard)
  @TsRestHandler(contract.systemAuth.getRouters)
  getRouters(@Request() req: FastifyRequest) {
    return tsRestHandler(contract.systemAuth.getRouters, async () => {
      const routers = await this.authService.getRouters(req);
      return { status: 200, body: ApiResult.ok(routers) };
    });
  }

  @TsRestHandler(contract.systemAuth.refreshToken)
  refreshToken() {
    return tsRestHandler(contract.systemAuth.refreshToken, async ({ body }) => {
      const res = await this.authService.refreshToken(body.refreshToken);
      return { status: 200, body: ApiResult.ok(res) };
    });
  }
}
