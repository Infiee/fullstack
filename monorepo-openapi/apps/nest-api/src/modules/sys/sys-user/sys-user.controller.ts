import { Body, Controller, Post, UsePipes } from '@nestjs/common';
import { SysUserService } from './sys-user.service';
import { LoginDto, LoginSchema, LoginInput } from './dto/user.dto';
import { ValibotPipe } from 'src/pipes/validation.pipe';
import { ApiBody } from '@nestjs/swagger';

@Controller('system/user')
export class SysUserController {
  constructor(private readonly sysUserService: SysUserService) {}

  @ApiBody({ schema: LoginDto })
  @UsePipes(new ValibotPipe(LoginSchema))
  @Post('/login')
  getUser(@Body() dto: LoginInput): OpenApi.SysUser {
    return this.sysUserService.getUser(dto);
  }
}
