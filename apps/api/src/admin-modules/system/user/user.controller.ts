import { Controller, UseGuards } from '@nestjs/common';
import { UserService } from './user.service';
import { TsRestHandler, tsRestHandler } from '@ts-rest/nest';
import { contract } from '@repo/rest-contract';
import { AuthGuard } from '@/core/guard/auth.guard';
import '@ts-rest/core';

@UseGuards(AuthGuard)
@Controller()
export class UserController {
  constructor(private readonly userService: UserService) {}

  @TsRestHandler(contract.systemUser.create)
  create() {
    return tsRestHandler(contract.systemUser.create, async ({ body }) => {
      const user = await this.userService.create(body);
      return { status: 201, body: user[0] };
    });
  }

  @TsRestHandler(contract.systemUser.getAll)
  getAll() {
    return tsRestHandler(contract.systemUser.getAll, async ({ query }) => {
      const users = await this.userService.getAll(query);
      return { status: 200, body: users };
    });
  }

  @TsRestHandler(contract.systemUser.findById)
  findById() {
    return tsRestHandler(contract.systemUser.findById, async ({ params }) => {
      const user = await this.userService.findById(params.id);
      return { status: 200, body: user[0] };
    });
  }

  @TsRestHandler(contract.systemUser.update)
  update() {
    return tsRestHandler(
      contract.systemUser.update,
      async ({ params, body }) => {
        const user = await this.userService.update(params.id, body);
        return { status: 200, body: user[0] };
      },
    );
  }

  @TsRestHandler(contract.systemUser.remove)
  remove() {
    return tsRestHandler(contract.systemUser.remove, async ({ params }) => {
      const user = await this.userService.remove(params.id);
      return { status: 200, body: user[0] };
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
          body: { message: '用户角色分配成功' },
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
        return { status: 200, body: { message: '密码重置成功' } };
      },
    );
  }

  @TsRestHandler(contract.systemUser.getRoleIds)
  getRoleIds() {
    return tsRestHandler(contract.systemUser.getRoleIds, async ({ params }) => {
      const roleIds = await this.userService.getRoleIds(params.id);
      return {
        status: 200,
        body: roleIds,
      };
    });
  }
}
