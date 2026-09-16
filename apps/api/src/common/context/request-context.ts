import { AsyncLocalStorage } from 'node:async_hooks';

export interface RequestContextData {
  requestId: string;
  method: string;
  path: string;
  startedAt: Date;
  userId?: string;
}

export class RequestContext {
  private readonly storage =
    new AsyncLocalStorage<RequestContextData>();

  run<T>(
    context: RequestContextData,
    callback: () => T,
  ): T {
    return this.storage.run(context, callback);
  }

  get(): RequestContextData | undefined {
    return this.storage.getStore();
  }

  getRequestId(): string | undefined {
    return this.storage.getStore()?.requestId;
  }

  getMethod(): string | undefined {
    return this.storage.getStore()?.method;
  }

  getPath(): string | undefined {
    return this.storage.getStore()?.path;
  }

  setUserId(userId: string): void {
    const context = this.storage.getStore();

    if (!context) {
      return;
    }

    context.userId = userId;
  }
}