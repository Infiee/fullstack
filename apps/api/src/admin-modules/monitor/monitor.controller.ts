import { Controller } from '@nestjs/common';
import { MonitorService } from './monitor.service';
import { TsRestHandler, tsRestHandler } from '@ts-rest/nest';
import { contract } from '@repo/contract';
import { ApiResult } from '@/common/utils/api-result';

@Controller()
export class MonitorController {
  constructor(private readonly monitorService: MonitorService) {}

  @TsRestHandler(contract.monitorOnline.filterAll)
  onlineFilterAll() {
    return tsRestHandler(
      contract.monitorOnline.filterAll,
      async ({ query }) => {
        const data = await this.monitorService.onlineFilterAll(query);
        return { status: 200, body: ApiResult.ok(data) };
      },
    );
  }
}
