import { Logger } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { AppExceptionFilter } from './ExceptionHandler/ExceptionHandler';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const logger = new Logger("main");
  const port = 3000;
  app.useGlobalFilters(new AppExceptionFilter());
  await app.listen(port);
  logger.log(`Connected. Listening on port ${port} ...`)
}
bootstrap();
