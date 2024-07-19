import { Controller, UseGuards } from '@nestjs/common';
import { UserService } from './user.service';
import { TsRestHandler, tsRestHandler } from '@ts-rest/nest';
import { contract } from '@repo/shared';
import { AuthGuard } from '@/core/guard/auth.guard';
import { ApiResult } from '@/common/utils/api-result';

@UseGuards(AuthGuard)
@Controller()
export class UserController {
  constructor(private readonly userService: UserService) {}

  @TsRestHandler(contract.sysUser.create)
  create() {
    return tsRestHandler(contract.sysUser.create, async ({ body }) => {
      const users = await this.userService.create(body);
      return { status: 201, body: ApiResult.ok(users[0], '创建用户成功') };
    });
  }

  @TsRestHandler(contract.sysUser.filterAll)
  filterAll() {
    return tsRestHandler(contract.sysUser.filterAll, async ({ query }) => {
      const res = await this.userService.filterAll(query);
      return { status: 200, body: ApiResult.ok(res) };
    });
  }

  @TsRestHandler(contract.sysUser.findById)
  findById() {
    return tsRestHandler(contract.sysUser.findById, async ({ params }) => {
      const users = await this.userService.findById(params.id);
      return { status: 200, body: ApiResult.ok(users[0]) };
    });
  }

  @TsRestHandler(contract.sysUser.update)
  update() {
    return tsRestHandler(contract.sysUser.update, async ({ params, body }) => {
      const users = await this.userService.update(params.id, body);
      return { status: 200, body: ApiResult.ok(users[0]) };
    });
  }

  @TsRestHandler(contract.sysUser.remove)
  remove() {
    return tsRestHandler(contract.sysUser.remove, async ({ params }) => {
      const users = await this.userService.remove(params.id);
      return { status: 200, body: ApiResult.ok(users[0]) };
    });
  }

  @TsRestHandler(contract.sysUser.batchRemove)
  batchRemove() {
    return tsRestHandler(contract.sysUser.batchRemove, async ({ body }) => {
      await this.userService.batchRemove(body.ids);
      return { status: 200, body: ApiResult.ok(null) };
    });
  }

  @TsRestHandler(contract.sysUser.assignRole)
  assignRole() {
    return tsRestHandler(
      contract.sysUser.assignRole,
      async ({ params, body }) => {
        await this.userService.assignRole(params.id, body.roleIds);
        return {
          status: 200,
          body: ApiResult.ok(null, '分配角色成功'),
        };
      },
    );
  }

  @TsRestHandler(contract.sysUser.resetPassword)
  resetPassword() {
    return tsRestHandler(
      contract.sysUser.resetPassword,
      async ({ params, body }) => {
        await this.userService.resetPassword(params.id, body);
        return { status: 200, body: ApiResult.ok(null, '重置密码成功') };
      },
    );
  }

  @TsRestHandler(contract.sysUser.getRoleIds)
  getRoleIds() {
    return tsRestHandler(contract.sysUser.getRoleIds, async ({ params }) => {
      const roleIds = await this.userService.getRoleIds(params.id);
      return {
        status: 200,
        body: ApiResult.ok(roleIds),
      };
    });
  }
}
