import { Controller, Request, UseGuards } from '@nestjs/common';
import { SystemAuthService } from './auth.service';
import { TsRestHandler, tsRestHandler } from '@ts-rest/nest';
import { contract } from '@repo/shared';
import { AuthGuard } from '@/core/guard/auth.guard';
import { ApiResult } from '@/common/utils/api-result';
import { FastifyRequest } from 'fastify';
import { UAParser } from 'ua-parser-js';
import { getClientIp } from '@supercharge/request-ip';
import {
  getRealAddressByIp,
  getClientIP as getIp,
} from '@/common/utils/ip2region/index';

@Controller()
export class SystemAuthController {
  constructor(private readonly authService: SystemAuthService) {}

  @TsRestHandler(contract.systemAuth.getCaptchaImage)
  generateCaptcha() {
    return tsRestHandler(contract.systemAuth.getCaptchaImage, async () => {
      const data = await this.authService.generateCaptcha();
      return { status: 200, body: ApiResult.ok(data) };
    });
  }

  @TsRestHandler(contract.systemAuth.login)
  login(@Request() req: FastifyRequest) {
    return tsRestHandler(contract.systemAuth.login, async ({ body }) => {
      const ua = req.headers['user-agent'];
      const parser = UAParser(ua);
      const realIp = getClientIp(req);
      const address = realIp ? await getRealAddressByIp(realIp) : '';

      const clientInfo = {
        ip: realIp ? getIp(realIp) : '',
        browser: parser.browser.name + ' ' + parser.browser.version,
        address: address,
        system: parser.os.name + ' ' + parser.os.version,
        behavior: '账号登录',
      };

      const data = await this.authService.login(body, clientInfo);
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
