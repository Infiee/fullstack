import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  await app.listen(3000,'0.0.0.0');
  console.log(`app 运行在host: http://localhost:3000`,process.env.ORM);
}
bootstrap();
