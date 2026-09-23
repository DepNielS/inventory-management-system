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
import { AuthController } from './auth.controller.js';
import { WarehouseScopeService } from './warehouse-scope.service.js';
import { WarehouseScopeGuard } from './guards/warehouse-scope.guard.js';

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
  
  controllers: [AuthController],

  providers: [
    PasswordService,
    AuthService,
    JwtStrategy,
    WarehouseScopeService,
    WarehouseScopeGuard,
  ],

  exports: [
    PasswordService,
    AuthService,
    JwtModule,
    WarehouseScopeService,
    WarehouseScopeGuard,
  ],
})
export class AuthModule {}