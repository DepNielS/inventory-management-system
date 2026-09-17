import {
  ValidationPipe,
  VersioningType,
} from '@nestjs/common';
import type { INestApplication } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Test } from '@nestjs/testing';
import dotenv from 'dotenv';
import request from 'supertest';
import {
  afterAll,
  beforeAll,
  describe,
  expect,
  it,
} from 'vitest';

import { AppModule } from '../src/app.module.js';
import { HttpExceptionFilter } from '../src/common/filters/http-exception.filter.js';
import { ResponseInterceptor } from '../src/common/interceptors/response.interceptor.js';

dotenv.config({
  path: '../../.env',
});

describe('Authentication Failure Cases (e2e)', () => {
  let app: INestApplication;
  let jwtService: JwtService;

  beforeAll(async () => {
    const moduleFixture = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();

    app.setGlobalPrefix('api');

    app.enableVersioning({
      type: VersioningType.URI,
    });

    app.useGlobalPipes(
      new ValidationPipe({
        transform: true,
        whitelist: true,
        forbidNonWhitelisted: true,
      }),
    );

    app.useGlobalFilters(
      app.get(HttpExceptionFilter),
    );

    app.useGlobalInterceptors(
      app.get(ResponseInterceptor),
    );

    await app.init();

    jwtService = app.get(JwtService);
  });

  afterAll(async () => {
    if (app) {
      await app.close();
    }
  });

  it('should reject login with incorrect password', async () => {
    const response = await request(app.getHttpServer())
      .post('/api/v1/auth/login')
      .send({
        email: 'admin@sinar-distribusi.local',
        password: 'incorrect-password',
      })
      .expect(401);

    expect(response.body.success).toBe(false);
    expect(response.body.statusCode).toBe(401);
    expect(response.body.message).toBe(
      'Invalid email or password.',
    );
  });

  it('should reject login with unknown email', async () => {
    const response = await request(app.getHttpServer())
      .post('/api/v1/auth/login')
      .send({
        email: 'unknown@sinar-distribusi.local',
        password: 'any-password',
      })
      .expect(401);

    expect(response.body.success).toBe(false);
    expect(response.body.statusCode).toBe(401);
    expect(response.body.message).toBe(
      'Invalid email or password.',
    );
  });

  it('should reject login with invalid email format', async () => {
    const response = await request(app.getHttpServer())
      .post('/api/v1/auth/login')
      .send({
        email: 'invalid-email',
        password: 'any-password',
      })
      .expect(400);

    expect(response.body.success).toBe(false);
    expect(response.body.statusCode).toBe(400);
  });

  it('should reject login with unexpected fields', async () => {
    const response = await request(app.getHttpServer())
      .post('/api/v1/auth/login')
      .send({
        email: 'admin@sinar-distribusi.local',
        password: 'any-password',
        unexpectedField: 'not-allowed',
      })
      .expect(400);

    expect(response.body.success).toBe(false);
    expect(response.body.statusCode).toBe(400);
  });

  it('should reject malformed JWT', async () => {
    const response = await request(app.getHttpServer())
      .get('/api/v1/auth/me')
      .set('Authorization', 'Bearer invalid.jwt.token')
      .expect(401);

    expect(response.body.success).toBe(false);
    expect(response.body.statusCode).toBe(401);
  });

  it('should reject expired JWT', async () => {
    const expiredToken = await jwtService.signAsync(
      {
        sub: '00000000-0000-0000-0000-000000000001',
        employeeCode: 'EMP-0001',
        email: 'admin@sinar-distribusi.local',
      },
      {
        expiresIn: '1ms',
      },
    );

    await new Promise((resolve) => setTimeout(resolve, 20));

    const response = await request(app.getHttpServer())
      .get('/api/v1/auth/me')
      .set('Authorization', `Bearer ${expiredToken}`)
      .expect(401);

    expect(response.body.success).toBe(false);
    expect(response.body.statusCode).toBe(401);
  });
});