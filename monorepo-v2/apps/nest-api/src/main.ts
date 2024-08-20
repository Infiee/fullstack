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
    new FastifyAdapter({
      // bodyLimit: 50 * 1024 * 1024,
    }),
  );
  await setupApp(app);
  await app.listen(port, '0.0.0.0');
  console.log(`app 运行在host: http://localhost:${port}/openapi`);
}
bootstrap();
