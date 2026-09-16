import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import type { Request, Response } from 'express';

interface ErrorResponseBody {
  success: false;
  statusCode: number;
  message: string | string[];
  path: string;
  timestamp: string;
}

@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
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
        message = responseMessage as string | string[];
      }
    }

    const errorResponse: ErrorResponseBody = {
      success: false,
      statusCode,
      message,
      path: request.url,
      timestamp: new Date().toISOString(),
    };

    response.status(statusCode).json(errorResponse);
  }
}