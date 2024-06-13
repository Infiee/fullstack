import { Controller } from '@nestjs/common';
import { MenuService } from './menu.service';
import { TsRestHandler, tsRestHandler } from '@ts-rest/nest';
import { contract } from '@repo/rest-contract';
import '@ts-rest/core';

@Controller()
export class MenuController {
  constructor(private readonly menuService: MenuService) {}

  @TsRestHandler(contract.systemMenu.create)
  create() {
    return tsRestHandler(contract.systemMenu.create, async ({ body }) => {
      const user = await this.menuService.create(body);
      return { status: 201, body: user[0] };
    });
  }

  @TsRestHandler(contract.systemMenu.getAll)
  getAll() {
    return tsRestHandler(contract.systemMenu.getAll, async () => {
      const menus = await this.menuService.getAll();
      return { status: 200, body: menus };
    });
  }

  @TsRestHandler(contract.systemMenu.getOne)
  getOne() {
    return tsRestHandler(contract.systemMenu.getOne, async ({ params }) => {
      const user = await this.menuService.getOne(params.id);
      return { status: 200, body: user[0] };
    });
  }

  @TsRestHandler(contract.systemMenu.update)
  update() {
    return tsRestHandler(
      contract.systemMenu.update,
      async ({ params, body }) => {
        const user = await this.menuService.update(params.id, body);
        return { status: 200, body: user[0] };
      },
    );
  }

  @TsRestHandler(contract.systemMenu.remove)
  remove() {
    return tsRestHandler(contract.systemMenu.remove, async ({ params }) => {
      const user = await this.menuService.remove(params.id);
      return { status: 204, body: user[0] };
    });
  }
}
