import { Injectable, Logger } from '@nestjs/common';

import { RequestContext } from '../context/request-context.js';

@Injectable()
export class AppLoggerService {
  private readonly logger = new Logger();

  constructor(
    private readonly requestContext: RequestContext,
  ) {}

  log(message: string): void {
    this.logger.log(this.formatMessage(message));
  }

  warn(message: string): void {
    this.logger.warn(this.formatMessage(message));
  }

  error(
    message: string,
    trace?: string,
  ): void {
    this.logger.error(
      this.formatMessage(message),
      trace,
    );
  }

  debug(message: string): void {
    this.logger.debug(this.formatMessage(message));
  }

  verbose(message: string): void {
    this.logger.verbose(this.formatMessage(message));
  }

  private formatMessage(message: string): string {
    const context = this.requestContext.get();

    if (!context) {
      return message;
    }

    return `[requestId=${context.requestId}] ${context.method} ${context.path} - ${message}`;
  }
}