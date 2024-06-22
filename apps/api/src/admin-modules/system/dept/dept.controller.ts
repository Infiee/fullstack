import { Controller, UseGuards } from '@nestjs/common';
import { DeptService } from './dept.service';
import { TsRestHandler, tsRestHandler } from '@ts-rest/nest';
import { contract } from '@repo/contract';
import { AuthGuard } from '@/core/guard/auth.guard';
import '@ts-rest/core';
import { ApiResult } from '@/common/utils/api-result';

@UseGuards(AuthGuard)
@Controller()
export class DeptController {
  constructor(private readonly deptService: DeptService) {}

  @TsRestHandler(contract.systemDept.create)
  create() {
    return tsRestHandler(contract.systemDept.create, async ({ body }) => {
      const user = await this.deptService.create(body);
      return { status: 201, body: ApiResult.ok(user[0], '创建角色成功') };
    });
  }

  @TsRestHandler(contract.systemDept.update)
  update() {
    return tsRestHandler(
      contract.systemDept.update,
      async ({ params, body }) => {
        const user = await this.deptService.update(params.id, body);
        return { status: 200, body: ApiResult.ok(user[0]) };
      },
    );
  }

  @TsRestHandler(contract.systemDept.remove)
  remove() {
    return tsRestHandler(contract.systemDept.remove, async ({ params }) => {
      const user = await this.deptService.remove(params.id);
      return { status: 200, body: ApiResult.ok(user[0]) };
    });
  }

  @TsRestHandler(contract.systemDept.filterAll)
  filterAll() {
    return tsRestHandler(contract.systemDept.filterAll, async ({ query }) => {
      const res = await this.deptService.filterAll(query);
      return {
        status: 200,
        body: ApiResult.ok(res),
      };
    });
  }
}
