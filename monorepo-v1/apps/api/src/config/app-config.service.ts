import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { EnvConfig } from './configuration';

@Injectable()
export class AppConfigService {
  constructor(private configService: ConfigService<EnvConfig, true>) {}
  get<T extends keyof EnvConfig>(key: T) {
    return this.configService.get(key, { infer: true });
  }

  /** 是否开发环境 */
  isDevEnv() {
    return process.env.NODE_ENV === 'development';
  }
}
