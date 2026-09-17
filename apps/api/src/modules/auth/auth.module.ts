import { Module } from '@nestjs/common';
import {
  ConfigModule,
  ConfigService,
} from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import type {
  JwtSignOptions,
} from '@nestjs/jwt';

import { PasswordService } from './password.service.js';

@Module({
  imports: [
    ConfigModule,

    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],

      useFactory: (
        configService: ConfigService,
      ) => ({
        secret: configService.getOrThrow<string>(
          'auth.jwtSecret',
        ),

        signOptions: {
          expiresIn:
            configService.getOrThrow<string>(
              'auth.jwtExpiresIn',
            ) as JwtSignOptions['expiresIn'],
        },
      }),
    }),
  ],

  providers: [
    PasswordService,
  ],

  exports: [
    PasswordService,
    JwtModule,
  ],
})
export class AuthModule {}