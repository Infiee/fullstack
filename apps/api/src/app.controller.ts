import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';
import { SystemStatusEnum } from '@repo/drizzle';
import { contract } from '@repo/rest-contract';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getHello(): any {
    // return this.appService.getHello();
    return SystemStatusEnum;
  }

}
