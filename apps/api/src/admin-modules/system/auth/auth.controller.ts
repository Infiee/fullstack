import { Controller, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { TsRestHandler, tsRestHandler } from '@ts-rest/nest';
import { contract } from '@repo/rest-contract';
import { AuthGuard } from '@/core/guard/auth.guard';

@Controller()
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @TsRestHandler(contract.systemAuth.getCaptchaImage)
  generateCaptcha() {
    return tsRestHandler(contract.systemAuth.getCaptchaImage, async () => {
      const data = await this.authService.generateCaptcha();
      return { status: 200, body: data };
    });
  }

  @TsRestHandler(contract.systemAuth.login)
  login() {
    return tsRestHandler(contract.systemAuth.login, async ({ body }) => {
      const data = await this.authService.login(body);
      return { status: 200, body: data };
    });
  }

  @UseGuards(AuthGuard)
  @TsRestHandler(contract.systemAuth.getInfo)
  getInfo() {
    return tsRestHandler(contract.systemAuth.getInfo, async () => {
      const data = await this.authService.getInfo();
      return {
        status: 200,
        body: { ...data },
      };
    });
  }

  @UseGuards(AuthGuard)
  @TsRestHandler(contract.systemAuth.getRouters)
  getRouters() {
    return tsRestHandler(contract.systemAuth.getRouters, async () => {
      const routers = await this.authService.getRouters();
      return {
        status: 200,
        body: routers,
      };
    });
  }
}
