import {
  Controller,
  Get,
  Module,
  Query,
  ValidationPipe,
} from '@nestjs/common';
import { Test } from '@nestjs/testing';
import request from 'supertest';

import {
  ResponseInterceptor,
} from '../src/common/interceptors/response.interceptor.js';

import {
  RequestContext,
} from '../src/common/context/request-context.js';

import {
  PaginationQueryDto,
} from '../src/common/pagination/pagination.dto.js';

import {
  createPaginationMeta,
} from '../src/common/pagination/pagination.util.js';

@Controller('pagination-test')
class PaginationTestController {
  @Get()
  getPaginatedData(
    @Query() query: PaginationQueryDto,
  ) {
    const page = query.page;
    const limit = query.limit;

    const total = 45;

    return {
      data: [
        {
          id: '1',
          name: 'Rice Cooker',
        },
      ],
      meta: createPaginationMeta(
        {
          page,
          limit,
        },
        total,
      ),
    };
  }
}

@Module({
  controllers: [PaginationTestController],
  providers: [
    RequestContext,
    ResponseInterceptor,
  ],
})
class PaginationTestModule {}

describe('Pagination Response (e2e)', () => {
  async function createTestApp() {
    const moduleRef =
      await Test.createTestingModule({
        imports: [PaginationTestModule],
      }).compile();

    const app =
      moduleRef.createNestApplication();

    app.useGlobalPipes(
      new ValidationPipe({
        transform: true,
        whitelist: true,
        forbidNonWhitelisted: true,
      }),
    );

    app.useGlobalInterceptors(
      app.get(ResponseInterceptor),
    );

    await app.init();

    return app;
  }

  it('should return standard paginated response', async () => {
    const app = await createTestApp();

    const response = await request(app.getHttpServer())
      .get('/pagination-test')
      .query({
        page: 1,
        limit: 20,
      })
      .expect(200);

    expect(response.body).toMatchObject({
      success: true,
      statusCode: 200,
      message: 'Request successful',
      data: [
        {
          id: '1',
          name: 'Rice Cooker',
        },
      ],
      meta: {
        page: 1,
        limit: 20,
        total: 45,
        totalPages: 3,
      },
    });

    await app.close();
  });

  it('should use default pagination values', async () => {
    const app = await createTestApp();

    const response = await request(app.getHttpServer())
      .get('/pagination-test')
      .expect(200);

    expect(response.body.meta).toMatchObject({
      page: 1,
      limit: 20,
      total: 45,
      totalPages: 3,
    });

    await app.close();
  });

  it('should reject page below minimum', async () => {
    const app = await createTestApp();

    await request(app.getHttpServer())
      .get('/pagination-test')
      .query({
        page: 0,
        limit: 20,
      })
      .expect(400);

    await app.close();
  });

  it('should reject limit below minimum', async () => {
    const app = await createTestApp();

    await request(app.getHttpServer())
      .get('/pagination-test')
      .query({
        page: 1,
        limit: 0,
      })
      .expect(400);

    await app.close();
  });

  it('should reject limit above maximum', async () => {
    const app = await createTestApp();

    await request(app.getHttpServer())
      .get('/pagination-test')
      .query({
        page: 1,
        limit: 101,
      })
      .expect(400);

    await app.close();
  });
});