import {
  MiddlewareConsumer,
  Module,
  NestModule,
} from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

import { appConfig } from './config/app.config.js';
import { authConfig } from './config/auth.config.js';
import { corsConfig } from './config/cors.config.js';
import { databaseConfig } from './config/database.config.js';
import { validateEnvironment } from './config/env.validation.js';

import { AppController } from './app.controller.js';
import { AppService } from './app.service.js';
import { DatabaseModule } from './database/database.module.js';

import { RequestContext } from './common/context/request-context.js';
import { RequestContextMiddleware } from './common/context/request-context.middleware.js';
import { HttpExceptionFilter } from './common/filters/http-exception.filter.js';
import { ResponseInterceptor } from './common/interceptors/response.interceptor.js';
import { AppLoggerService } from './common/logging/app-logger.service.js';
import { RequestLoggingMiddleware } from './common/logging/request-logging.middleware.js';
import { HealthModule } from './health/health.module.js';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '../../.env',
      load: [
        appConfig,
        databaseConfig,
        authConfig,
        corsConfig,
      ],
      validate: validateEnvironment,
    }),

    DatabaseModule,
    HealthModule,
  ],

  controllers: [AppController],

  providers: [
    AppService,
    RequestContext,
    HttpExceptionFilter,
    ResponseInterceptor,
    AppLoggerService
  ],
})
export class AppModule implements NestModule {
  configure(
    consumer: MiddlewareConsumer,
  ): void {
    consumer
      .apply(
        RequestContextMiddleware,
        RequestLoggingMiddleware      
      )
      .forRoutes('*');
  }
}