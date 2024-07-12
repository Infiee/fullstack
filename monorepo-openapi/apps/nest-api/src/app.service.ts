import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  getHello(): OpenApi.SysUserResult {
    return {
      code: '36',
      data: {
        id: 87,
        userName: '杨娟',
        avatar: 'http://dummyimage.com/100x100',
        gender: '女',
        nickName: '丁霞',
        phone: '18105683341',
        email: 't.vwfgop@qq.com',
        createTime: '1982-01-01 16:55:55',
        updateTime: '1974-02-13 05:09:12',
      },
      message: 'aliqua est',
      success: false,
    };
  }
}
