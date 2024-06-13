import { NestFactory } from '@nestjs/core';
import {
  FastifyAdapter,
  NestFastifyApplication,
} from '@nestjs/platform-fastify';
import { getPortPromise } from 'portfinder';

import { AppModule } from './app.module';
import { setupApp } from './setup';

async function bootstrap() {
  // app运行端口
  const port = await getPortPromise({ port: 3000 });

  const app = await NestFactory.create<NestFastifyApplication>(
    AppModule,
    new FastifyAdapter(),
  );

  await setupApp(app);

  await app.listen(port);

  console.log(`app 运行在: http://localhost:${port}`);
}

bootstrap();
