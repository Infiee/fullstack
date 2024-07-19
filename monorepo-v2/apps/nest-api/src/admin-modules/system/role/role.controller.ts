import { Controller, UseGuards } from '@nestjs/common';
import { SystemRoleService } from './role.service';
import { TsRestHandler, tsRestHandler } from '@ts-rest/nest';
import { contract } from '@repo/shared';
import { AuthGuard } from '@/core/guard/auth.guard';
import { ApiResult } from '@/common/utils/api-result';

@UseGuards(AuthGuard)
@Controller()
export class SystemRoleController {
  constructor(private readonly roleService: SystemRoleService) {}

  @TsRestHandler(contract.systemRole.create)
  create() {
    return tsRestHandler(contract.systemRole.create, async ({ body }) => {
      const user = await this.roleService.create(body);
      return { status: 201, body: ApiResult.ok(user[0], '创建角色成功') };
    });
  }

  @TsRestHandler(contract.systemRole.getAll)
  getAll() {
    return tsRestHandler(contract.systemRole.getAll, async () => {
      const users = await this.roleService.getAll();
      return { status: 200, body: ApiResult.ok(users) };
    });
  }

  @TsRestHandler(contract.systemRole.getOne)
  getOne() {
    return tsRestHandler(contract.systemRole.getOne, async ({ params }) => {
      const user = await this.roleService.getOne(params.id);
      return { status: 200, body: ApiResult.ok(user[0]) };
    });
  }

  @TsRestHandler(contract.systemRole.update)
  update() {
    return tsRestHandler(
      contract.systemRole.update,
      async ({ params, body }) => {
        const user = await this.roleService.update(params.id, body);
        return { status: 200, body: ApiResult.ok(user[0]) };
      },
    );
  }

  @TsRestHandler(contract.systemRole.remove)
  remove() {
    return tsRestHandler(contract.systemRole.remove, async ({ params }) => {
      const user = await this.roleService.remove(params.id);
      return { status: 200, body: ApiResult.ok(user[0]) };
    });
  }

  @TsRestHandler(contract.systemRole.assignUser)
  assignRole() {
    return tsRestHandler(
      contract.systemRole.assignUser,
      async ({ params, body }) => {
        await this.roleService.assignUser(params.id, body.userIds);
        return {
          status: 200,
          body: ApiResult.ok(null, '分配角色成功'),
        };
      },
    );
  }

  @TsRestHandler(contract.systemRole.assignMenu)
  assignMenu() {
    return tsRestHandler(
      contract.systemRole.assignMenu,
      async ({ params, body }) => {
        await this.roleService.assignMenu(params.id, body.menuIds);
        return {
          status: 200,
          body: ApiResult.ok(null, '角色分配菜单成功'),
        };
      },
    );
  }

  @TsRestHandler(contract.systemRole.filterAll)
  filterAll() {
    return tsRestHandler(contract.systemRole.filterAll, async ({ query }) => {
      const res = await this.roleService.filterAll(query);
      return {
        status: 200,
        body: ApiResult.ok(res),
      };
    });
  }

  @TsRestHandler(contract.systemRole.getRoleMenu)
  getRoleMenu() {
    return tsRestHandler(
      contract.systemRole.getRoleMenu,
      async ({ params }) => {
        const res = await this.roleService.getRoleMenu(params.id);
        return {
          status: 200,
          body: ApiResult.ok(res),
        };
      },
    );
  }

  @TsRestHandler(contract.systemRole.getRoleMenuIds)
  getRoleMenuIds() {
    return tsRestHandler(
      contract.systemRole.getRoleMenuIds,
      async ({ params }) => {
        const res = await this.roleService.getRoleMenuIds(params.id);
        return {
          status: 200,
          body: ApiResult.ok(res),
        };
      },
    );
  }
}
