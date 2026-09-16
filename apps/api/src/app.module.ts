import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

import { appConfig } from './config/app.config.js';
import { authConfig } from './config/auth.config.js';
import { corsConfig } from './config/cors.config.js';
import { databaseConfig } from './config/database.config.js';
import { validateEnvironment } from './config/env.validation.js';

import { AppController } from './app.controller.js';
import { AppService } from './app.service.js';
import { DatabaseModule } from './database/database.module.js';

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
  ],

  controllers: [AppController],

  providers: [AppService],
})
export class AppModule {}