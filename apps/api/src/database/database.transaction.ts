import type { createDatabaseClient } from './database.client.js';

export type Database = ReturnType<
  typeof createDatabaseClient
>['db'];

export type DatabaseTransaction =
  Parameters<Database['transaction']>[0] extends (
    tx: infer T,
    ...args: never[]
  ) => unknown
    ? T
    : never;

export class DatabaseTransactionError extends Error {
  constructor(message: string, cause?: unknown) {
    super(message);

    this.name = 'DatabaseTransactionError';

    if (cause instanceof Error) {
      this.cause = cause;
    }
  }
}

export class DatabaseTransactionHelper {
  constructor(private readonly db: Database) {}

  async run<T>(
    callback: (tx: DatabaseTransaction) => Promise<T>,
  ): Promise<T> {
    try {
      return await this.db.transaction(async (tx) => {
        return callback(tx as DatabaseTransaction);
      });
    } catch (error: unknown) {
      throw new DatabaseTransactionError(
        'Database transaction failed.',
        error,
      );
    }
  }
}