import {
  Injectable,
  NestMiddleware,
} from '@nestjs/common';
import type {
  NextFunction,
  Request,
  Response,
} from 'express';
import { randomUUID } from 'node:crypto';

import { RequestContext } from './request-context.js';

@Injectable()
export class RequestContextMiddleware
  implements NestMiddleware
{
  constructor(
    private readonly requestContext: RequestContext,
  ) {}

  use(
    request: Request,
    _response: Response,
    next: NextFunction,
  ): void {
    const context = {
      requestId: randomUUID(),
      method: request.method,
      path: request.originalUrl,
      startedAt: new Date(),
    };

    this.requestContext.run(context, next);
  }
}