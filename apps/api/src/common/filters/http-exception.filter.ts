import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
} from '@nestjs/common';
import type { Request, Response } from 'express';

import { RequestContext } from '../context/request-context.js';

interface ErrorResponseBody {
  success: false;
  statusCode: number;
  message: string | string[];
  path: string;
  timestamp: string;
  requestId?: string;
}

@Catch(HttpException)
export class HttpExceptionFilter
  implements ExceptionFilter
{
  constructor(
    private readonly requestContext: RequestContext,
  ) {}

  catch(
    exception: HttpException,
    host: ArgumentsHost,
  ): void {
    const context = host.switchToHttp();

    const response = context.getResponse<Response>();
    const request = context.getRequest<Request>();

    const statusCode = exception.getStatus();

    const exceptionResponse = exception.getResponse();

    let message: string | string[] = exception.message;

    if (typeof exceptionResponse === 'string') {
      message = exceptionResponse;
    }

    if (
      typeof exceptionResponse === 'object' &&
      exceptionResponse !== null &&
      'message' in exceptionResponse
    ) {
      const responseMessage = (
        exceptionResponse as { message?: unknown }
      ).message;

      if (
        typeof responseMessage === 'string' ||
        Array.isArray(responseMessage)
      ) {
        message =
          responseMessage as string | string[];
      }
    }

    const errorResponse: ErrorResponseBody = {
      success: false,
      statusCode,
      message,
      path: request.url,
      timestamp: new Date().toISOString(),
      requestId:
        this.requestContext.getRequestId(),
    };

    response
      .status(statusCode)
      .json(errorResponse);
  }
}