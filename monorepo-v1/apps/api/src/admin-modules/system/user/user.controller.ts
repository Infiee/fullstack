import { Controller, UseGuards } from '@nestjs/common';
import { UserService } from './user.service';
import { TsRestHandler, tsRestHandler } from '@ts-rest/nest';
import { contract } from '@repo/contract';
import { AuthGuard } from '@/core/guard/auth.guard';
import { ApiResult } from '@/common/utils/api-result';

@UseGuards(AuthGuard)
@Controller()
export class UserController {
  constructor(private readonly userService: UserService) {}

  @TsRestHandler(contract.systemUser.create)
  create() {
    return tsRestHandler(contract.systemUser.create, async ({ body }) => {
      const users = await this.userService.create(body);
      return { status: 201, body: ApiResult.ok(users[0], '创建用户成功') };
    });
  }

  @TsRestHandler(contract.systemUser.filterAll)
  filterAll() {
    return tsRestHandler(contract.systemUser.filterAll, async ({ query }) => {
      const res = await this.userService.filterAll(query);
      return { status: 200, body: ApiResult.ok(res) };
    });
  }

  @TsRestHandler(contract.systemUser.findById)
  findById() {
    return tsRestHandler(contract.systemUser.findById, async ({ params }) => {
      const users = await this.userService.findById(params.id);
      return { status: 200, body: ApiResult.ok(users[0]) };
    });
  }

  @TsRestHandler(contract.systemUser.update)
  update() {
    return tsRestHandler(
      contract.systemUser.update,
      async ({ params, body }) => {
        const users = await this.userService.update(params.id, body);
        return { status: 200, body: ApiResult.ok(users[0]) };
      },
    );
  }

  @TsRestHandler(contract.systemUser.remove)
  remove() {
    return tsRestHandler(contract.systemUser.remove, async ({ params }) => {
      const users = await this.userService.remove(params.id);
      return { status: 200, body: ApiResult.ok(users[0]) };
    });
  }

  @TsRestHandler(contract.systemUser.batchRemove)
  batchRemove() {
    return tsRestHandler(contract.systemUser.batchRemove, async ({ body }) => {
      await this.userService.batchRemove(body.ids);
      return { status: 200, body: ApiResult.ok(null) };
    });
  }

  @TsRestHandler(contract.systemUser.assignRole)
  assignRole() {
    return tsRestHandler(
      contract.systemUser.assignRole,
      async ({ params, body }) => {
        await this.userService.assignRole(params.id, body.roleIds);
        return {
          status: 200,
          body: ApiResult.ok(null, '分配角色成功'),
        };
      },
    );
  }

  @TsRestHandler(contract.systemUser.resetPassword)
  resetPassword() {
    return tsRestHandler(
      contract.systemUser.resetPassword,
      async ({ params, body }) => {
        await this.userService.resetPassword(params.id, body);
        return { status: 200, body: ApiResult.ok(null, '重置密码成功') };
      },
    );
  }

  @TsRestHandler(contract.systemUser.getRoleIds)
  getRoleIds() {
    return tsRestHandler(contract.systemUser.getRoleIds, async ({ params }) => {
      const roleIds = await this.userService.getRoleIds(params.id);
      return {
        status: 200,
        body: ApiResult.ok(roleIds),
      };
    });
  }
}
