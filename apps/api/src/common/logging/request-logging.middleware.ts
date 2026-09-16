import {
  Injectable,
  NestMiddleware,
} from '@nestjs/common';
import type {
  NextFunction,
  Request,
  Response,
} from 'express';

import { AppLoggerService } from './app-logger.service.js';

@Injectable()
export class RequestLoggingMiddleware
  implements NestMiddleware
{
  constructor(
    private readonly logger: AppLoggerService,
  ) {}

  use(
    request: Request,
    response: Response,
    next: NextFunction,
  ): void {
    const startedAt = Date.now();

    response.on('finish', () => {
      const duration = Date.now() - startedAt;

      this.logger.log(
        `${request.method} ${request.originalUrl} ${response.statusCode} - ${duration}ms`,
      );
    });

    next();
  }
}