import { Module } from '@nestjs/common';
import {
  ConfigModule,
  ConfigService,
} from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import type {
  JwtSignOptions,
} from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';

import { AuthService } from './auth.service.js';
import { PasswordService } from './password.service.js';
import { JwtStrategy } from './strategies/jwt.strategy.js';

@Module({
  imports: [
    ConfigModule,

    PassportModule,

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
    AuthService,
    JwtStrategy,
  ],

  exports: [
    PasswordService,
    AuthService,
    JwtModule,
  ],
})
export class AuthModule {}