import { Injectable } from '@nestjs/common';
import { LoginInput } from './dto/user.dto';

@Injectable()
export class SysUserService {
  getUser(dto: LoginInput): OpenApi.SysUser {
    return {
      id: 87,
      userName: '杨娟',
      avatar: 'http://dummyimage.com/100x100',
      gender: '女',
      nickName: '丁霞',
      phone: '18105683341',
      email: 't.vwfgop@qq.com',
      createTime: '1982-01-01 16:55:55',
      updateTime: '1974-02-13 05:09:12',
    };
  }
}
