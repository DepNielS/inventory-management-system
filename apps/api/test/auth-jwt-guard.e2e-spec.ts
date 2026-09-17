import {
  Controller,
  Get,
  Module,
  UseGuards,
} from '@nestjs/common';
import { Test } from '@nestjs/testing';
import { ConfigService } from '@nestjs/config';
import { PassportModule, AuthGuard } from '@nestjs/passport';
import request from 'supertest';

import { JwtStrategy } from '../src/modules/auth/strategies/jwt.strategy.js';

@Controller('auth-test')
class AuthTestController {
  @Get('protected')
  @UseGuards(AuthGuard('jwt'))
  protectedRoute() {
    return {
      authenticated: true,
    };
  }
}

@Module({
  imports: [
    PassportModule.register({
      defaultStrategy: 'jwt',
    }),
  ],

  controllers: [AuthTestController],

  providers: [
    JwtStrategy,

    {
      provide: ConfigService,
      useValue: {
        getOrThrow: (key: string) => {
          if (key === 'auth.jwtSecret') {
            return 'test-secret';
          }

          throw new Error(
            `Unknown configuration key: ${key}`,
          );
        },
      },
    },
  ],
})
class AuthTestModule {}

describe('JWT Auth Guard (e2e)', () => {
  async function createTestApp() {
    const moduleRef =
      await Test.createTestingModule({
        imports: [AuthTestModule],
      }).compile();

    const app =
      moduleRef.createNestApplication();

    await app.init();

    return app;
  }

  it('should reject request without JWT', async () => {
    const app = await createTestApp();

    await request(app.getHttpServer())
      .get('/auth-test/protected')
      .expect(401);

    await app.close();
  });
});