import {
  ArgumentMetadata,
  BadRequestException,
  Injectable,
  PipeTransform,
} from '@nestjs/common';
import * as v from 'valibot';

@Injectable()
export class ValibotPipe implements PipeTransform {
  constructor(private schema: any) {}

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  transform(value: any, metadata: ArgumentMetadata) {
    const result = v.safeParse(this.schema, value);
    if (result.success) {
      console.log('验证通过', result.output);
      return value;
    } else {
      console.log('校验错误', result);
      const { path, message } = result.issues[0];
      throw new BadRequestException(path[0].key + ' ' + message);
    }
  }
}
