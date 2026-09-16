import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import type {
  Request,
  Response,
} from 'express';

import {
  RequestContext,
} from '../context/request-context.js';

import type {
  PaginatedResult,
} from '../pagination/pagination.types.js';

export interface SuccessResponse<T> {
  success: true;
  statusCode: number;
  message: string;
  data: T;
  timestamp: string;
  path: string;
  requestId?: string;
}

export interface PaginatedSuccessResponse<T> {
  success: true;
  statusCode: number;
  message: string;
  data: T[];
  timestamp: string;
  path: string;
  requestId?: string;
  meta: PaginatedResult<T>['meta'];
}

@Injectable()
export class ResponseInterceptor<T>
  implements NestInterceptor<T>
{
  constructor(
    private readonly requestContext: RequestContext,
  ) {}

  intercept(
    context: ExecutionContext,
    next: CallHandler<T>,
  ): Observable<
    SuccessResponse<T> | PaginatedSuccessResponse<T>
  > {
    const httpContext = context.switchToHttp();

    const request = httpContext.getRequest<Request>();
    const response =
      httpContext.getResponse<Response>();

    return next.handle().pipe(
      map((result: T) => {
        if (this.isPaginatedResult(result)) {
          const paginatedResult =
            result as T & PaginatedResult<T>;

          return {
            success: true,
            statusCode: response.statusCode,
            message: 'Request successful',
            data: paginatedResult.data,
            timestamp: new Date().toISOString(),
            path: request.url,
            requestId:
              this.requestContext.getRequestId(),
            meta: paginatedResult.meta,
          };
        }

        return {
          success: true,
          statusCode: response.statusCode,
          message: 'Request successful',
          data: result,
          timestamp: new Date().toISOString(),
          path: request.url,
          requestId:
            this.requestContext.getRequestId(),
        };
      }),
    );
  }

  private isPaginatedResult(
    result: T,
  ): result is T & {
    data: unknown[];
    meta: PaginatedResult<T>['meta'];
  } {
    if (
      typeof result !== 'object' ||
      result === null
    ) {
      return false;
    }

    if (
      !('data' in result) ||
      !('meta' in result)
    ) {
      return false;
    }

    const value = result as {
      data?: unknown;
      meta?: unknown;
    };

    return (
      Array.isArray(value.data) &&
      typeof value.meta === 'object' &&
      value.meta !== null
    );
  }
}