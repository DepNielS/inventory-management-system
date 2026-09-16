import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { ConfigService } from '@nestjs/config';

import { AppModule } from './app.module.js';
import { HttpExceptionFilter } from './common/filters/http-exception.filter.js';
import { ResponseInterceptor } from './common/interceptors/response.interceptor.js';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      whitelist: true,
      forbidNonWhitelisted: true,
    }),
  );

  const httpExceptionFilter =
    app.get(HttpExceptionFilter);

  const responseInterceptor =
    app.get(ResponseInterceptor);

  app.useGlobalFilters(httpExceptionFilter);

  app.useGlobalInterceptors(responseInterceptor);

  const configService = app.get(ConfigService);

  const port = configService.get<number>(
    'app.port',
    3001,
  );

  await app.listen(port);
}

bootstrap();