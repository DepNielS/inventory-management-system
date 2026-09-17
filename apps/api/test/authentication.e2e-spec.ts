import { ValidationPipe, VersioningType } from '@nestjs/common';
import type { INestApplication } from '@nestjs/common';
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

describe('Authentication (e2e)', () => {
  let app: INestApplication;

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
  });

 afterAll(async () => {
  if (app) {
    await app.close();
  }
});
  async function loginAndGetAccessToken(): Promise<string> {
    const password = process.env.SEED_ADMIN_PASSWORD;

    expect(password).toBeTruthy();

    const response = await request(app.getHttpServer())
      .post('/api/v1/auth/login')
      .send({
        email: 'admin@sinar-distribusi.local',
        password,
      })
      .expect(200);

    expect(response.body.success).toBe(true);
    expect(response.body.statusCode).toBe(200);
    expect(response.body.data).toHaveProperty('accessToken');

    return response.body.data.accessToken;
  }

  it('should login successfully with valid credentials', async () => {
    const accessToken = await loginAndGetAccessToken();

    expect(typeof accessToken).toBe('string');
    expect(accessToken.length).toBeGreaterThan(0);
  });

  it('should access protected endpoint with valid JWT', async () => {
    const accessToken = await loginAndGetAccessToken();

    const response = await request(app.getHttpServer())
      .get('/api/v1/auth/me')
      .set('Authorization', `Bearer ${accessToken}`)
      .expect(200);

    expect(response.body.success).toBe(true);
    expect(response.body.statusCode).toBe(200);

    expect(response.body.data).toEqual({
      id: expect.any(String),
      employeeCode: 'EMP-0001',
      email: 'admin@sinar-distribusi.local',
    });
  });

  it('should reject protected endpoint without JWT', async () => {
    const response = await request(app.getHttpServer())
      .get('/api/v1/auth/me')
      .expect(401);

    expect(response.body.success).toBe(false);
    expect(response.body.statusCode).toBe(401);
  });
});