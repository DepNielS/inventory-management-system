import 'reflect-metadata';

import {
  INestApplication,
  ValidationPipe,
  VersioningType,
  Controller, Get,Module, UseGuards,
} from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import request from 'supertest';
import { describe, expect, beforeAll, afterAll, it } from 'vitest';
import { eq } from 'drizzle-orm';

import { AppModule } from '../src/app.module.js';
import { AuthModule } from '../src/modules/auth/auth.module.js';
import { AuthService } from '../src/modules/auth/auth.service.js';
import { JwtAuthGuard } from '../src/modules/auth/guards/jwt-auth.guard.js';
import { WarehouseScopeGuard } from '../src/modules/auth/guards/warehouse-scope.guard.js';
import { WarehouseScopeService } from '../src/modules/auth/warehouse-scope.service.js';
import { PermissionsModule } from '../src/modules/permissions/permissions.module.js';
import { PermissionsService } from '../src/modules/permissions/permissions.service.js';
import { PERMISSIONS_KEY } from '../src/modules/permissions/decorators/permissions.decorator.js';
import { RolesModule } from '../src/modules/roles/roles.module.js';
import { RbacGuard } from '../src/modules/roles/guards/rbac.guard.js';
import { Roles } from '../src/modules/roles/decorators/roles.decorator.js';
import { Permissions } from '../src/modules/permissions/decorators/permissions.decorator.js';

import { DATABASE } from '../src/database/database.module.js';
import type { Database } from '../src/database/database.transaction.js';
import { users } from '../src/database/schema/identity/users.js';

import { HttpExceptionFilter } from '../src/common/filters/http-exception.filter.js';
import { ResponseInterceptor } from '../src/common/interceptors/response.interceptor.js';

@Controller({
  path: 'test/authorization',
  version: '1',
})
class AuthorizationTestController {
  @Get('warehouse-resource')
  @Roles('Admin')
  @Permissions('__dynamic_permission__')
  @UseGuards(
    JwtAuthGuard,
    RbacGuard,
    WarehouseScopeGuard,
  )
  getWarehouseResource() {
    return {
      message: 'Authorization passed',
    };
  }
}

@Module({
  imports: [
    AppModule,
    AuthModule,
    RolesModule,
    PermissionsModule,
  ],
  controllers: [AuthorizationTestController],
})
class AuthorizationTestModule {}

describe('Combined Authorization (e2e)', () => {
  let app: INestApplication;
  let moduleFixture: TestingModule;

  let adminToken: string;
  let adminWarehouseId: string;
  let outsideWarehouseId: string;

  beforeAll(async () => {
    moduleFixture = await Test.createTestingModule({
      imports: [AuthorizationTestModule],
    }).compile();

    const db = moduleFixture.get<Database>(DATABASE);

    const authService =
      moduleFixture.get<AuthService>(AuthService);

    const permissionsService =
      moduleFixture.get<PermissionsService>(PermissionsService);

    const warehouseScopeService =
      moduleFixture.get<WarehouseScopeService>(
        WarehouseScopeService,
      );

    const [adminUser] = await db
      .select({
        id: users.id,
      })
      .from(users)
      .where(eq(users.email, 'admin@sinar-distribusi.local'))
      .limit(1);

    if (!adminUser) {
      throw new Error(
        'Seed admin user was not found.',
      );
    }

    const [managerUser] = await db
      .select({
        id: users.id,
      })
      .from(users)
      .where(
        eq(
          users.email,
          'manager@sinar-distribusi.local',
        ),
      )
      .limit(1);

    if (!managerUser) {
      throw new Error(
        'Seed manager user was not found.',
      );
    }

    const adminPermissions =
      await permissionsService.getPermissionNamesByUserId(
        adminUser.id,
      );

    if (adminPermissions.length === 0) {
      throw new Error(
        'Admin user has no permissions assigned.',
      );
    }

    Reflect.defineMetadata(
      PERMISSIONS_KEY,
      [adminPermissions[0]],
      AuthorizationTestController.prototype
        .getWarehouseResource,
    );

    const adminWarehouseIds =
      await warehouseScopeService.getWarehouseIdsByUserId(
        adminUser.id,
      );

    if (adminWarehouseIds.length === 0) {
      throw new Error(
        'Admin user has no warehouse scope assigned.',
      );
    }

    adminWarehouseId = adminWarehouseIds[0];

    const managerWarehouseIds =
      await warehouseScopeService.getWarehouseIdsByUserId(
        managerUser.id,
      );

    outsideWarehouseId =
      managerWarehouseIds.find(
        (warehouseId) =>
          !adminWarehouseIds.includes(warehouseId),
      ) ?? '';

    if (!outsideWarehouseId) {
      throw new Error(
        'Could not find a warehouse outside admin scope.',
      );
    }

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

    const loginResponse = await request(
      app.getHttpServer(),
    )
      .post('/api/v1/auth/login')
      .send({
        email: 'admin@sinar-distribusi.local',
        password: process.env.SEED_ADMIN_PASSWORD,
      })
      .expect(200);

    adminToken = loginResponse.body.data.accessToken;

    // Keep AuthService resolved so the dependency graph is verified.
    void authService;
  });

  afterAll(async () => {
    await app?.close();
  });

  it(
    'should allow access when role, permission, and warehouse scope are valid',
    async () => {
      const response = await request(
        app.getHttpServer(),
      )
        .get(
          `/api/v1/test/authorization/warehouse-resource?warehouseId=${adminWarehouseId}`,
        )
        .set(
          'Authorization',
          `Bearer ${adminToken}`,
        )
        .expect(200);

      expect(response.body).toBeDefined();
    },
  );

  it(
    'should reject access when warehouse is outside user scope',
    async () => {
      await request(app.getHttpServer())
        .get(
          `/api/v1/test/authorization/warehouse-resource?warehouseId=${outsideWarehouseId}`,
        )
        .set(
          'Authorization',
          `Bearer ${adminToken}`,
        )
        .expect(403);
    },
  );

  it(
    'should reject access without authentication',
    async () => {
      await request(app.getHttpServer())
        .get(
          `/api/v1/test/authorization/warehouse-resource?warehouseId=${adminWarehouseId}`,
        )
        .expect(401);
    },
  );

  it(
    'should reject access when warehouseId is missing',
    async () => {
      await request(app.getHttpServer())
        .get(
          '/api/v1/test/authorization/warehouse-resource',
        )
        .set(
          'Authorization',
          `Bearer ${adminToken}`,
        )
        .expect(400);
    },
  );
});