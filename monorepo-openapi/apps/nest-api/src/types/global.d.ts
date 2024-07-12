// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { components, paths } from '@shared/openapi';

declare global {
  namespace OpenApi {
    type SysUser = components['schemas']['SysUser'];

    type SysUserResult =
      paths['/sys/user/{id}']['get']['responses']['200']['content']['application/json'];
  }
}

// 如果你的模块没有导出任何内容，你将需要这一行。否则删除
export {};
