import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';

@Controller('/sys')
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get('/user/:id')
  getUser(): OpenApi.SysUserResult {
    console.log('接收了get apifox信息');
    return this.appService.getHello();
  }
}
