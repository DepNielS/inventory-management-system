import { Global, Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { createDatabaseClient } from './database.client.js';

export const DATABASE = Symbol('DATABASE');
export const DATABASE_POOL = Symbol('DATABASE_POOL');
const DATABASE_CLIENT = Symbol('DATABASE_CLIENT');

type DatabaseClient = ReturnType<typeof createDatabaseClient>;

@Global()
@Module({
  imports: [ConfigModule],
  providers: [
    {
      provide: DATABASE_CLIENT,
      inject: [ConfigService],
      useFactory: (configService: ConfigService): DatabaseClient => {
        const databaseUrl = configService.get<string>('DATABASE_URL');

        if (!databaseUrl) {
          throw new Error('DATABASE_URL is not configured.');
        }

        return createDatabaseClient(databaseUrl);
      },
    },
    {
      provide: DATABASE,
      inject: [DATABASE_CLIENT],
      useFactory: (client: DatabaseClient) => client.db,
    },
    {
      provide: DATABASE_POOL,
      inject: [DATABASE_CLIENT],
      useFactory: (client: DatabaseClient) => client.pool,
    },
  ],
  exports: [DATABASE, DATABASE_POOL],
})
export class DatabaseModule {}