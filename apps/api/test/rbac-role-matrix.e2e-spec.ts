import 'reflect-metadata';

import {
  Controller,
  Get,
  INestApplication,
  Module,
  UseGuards,
  ValidationPipe,
  VersioningType,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Test, TestingModule } from '@nestjs/testing';
import { eq } from 'drizzle-orm';
import request from 'supertest';
import {
  afterAll,
  beforeAll,
  describe,
  expect,
  it,
} from 'vitest';

import { AppModule } from '../src/app.module.js';

import { DATABASE } from '../src/database/database.module.js';
import type { Database } from '../src/database/database.transaction.js';
import { users } from '../src/database/schema/identity/users.js';

import { AuthModule } from '../src/modules/auth/auth.module.js';
import { JwtAuthGuard } from '../src/modules/auth/guards/jwt-auth.guard.js';
import { WarehouseScopeGuard } from '../src/modules/auth/guards/warehouse-scope.guard.js';
import { WarehouseScopeService } from '../src/modules/auth/warehouse-scope.service.js';

import { RolesModule } from '../src/modules/roles/roles.module.js';
import { RolesService } from '../src/modules/roles/roles.service.js';
import { Roles } from '../src/modules/roles/decorators/roles.decorator.js';
import { RbacGuard } from '../src/modules/roles/guards/rbac.guard.js';

import { PermissionsModule } from '../src/modules/permissions/permissions.module.js';

import { HttpExceptionFilter } from '../src/common/filters/http-exception.filter.js';
import { ResponseInterceptor } from '../src/common/interceptors/response.interceptor.js';

const ROLE_NAMES = [
  'Admin',
  'Purchasing Staff',
  'Warehouse Staff',
  'Warehouse Manager',
  'Management',
] as const;

type RoleName = (typeof ROLE_NAMES)[number];

const ROLE_MATRIX = [
  {
    employeeCode: 'EMP-0001',
    email: 'admin@sinar-distribusi.local',
    role: 'Admin',
  },
  {
    employeeCode: 'EMP-0002',
    email: 'purchasing@sinar-distribusi.local',
    role: 'Purchasing Staff',
  },
  {
    employeeCode: 'EMP-0003',
    email: 'warehouse.palembang@sinar-distribusi.local',
    role: 'Warehouse Staff',
  },
  {
    employeeCode: 'EMP-0004',
    email: 'manager@sinar-distribusi.local',
    role: 'Warehouse Manager',
  },
  {
    employeeCode: 'EMP-0005',
    email: 'management@sinar-distribusi.local',
    role: 'Management',
  },
] satisfies ReadonlyArray<{
  employeeCode: string;
  email: string;
  role: RoleName;
}>;

const OUTSIDE_WAREHOUSE_ID =
  '00000000-0000-0000-0000-000000000000';

@Controller({
  path: 'test/rbac',
  version: '1',
})
class RbacRoleMatrixTestController {
  @Get('admin')
  @Roles('Admin')
  @UseGuards(JwtAuthGuard, RbacGuard)
  adminResource() {
    return {
      message: 'Admin access granted',
    };
  }

  @Get('purchasing')
  @Roles('Purchasing Staff')
  @UseGuards(JwtAuthGuard, RbacGuard)
  purchasingResource() {
    return {
      message: 'Purchasing access granted',
    };
  }

  @Get('warehouse-staff')
  @Roles('Warehouse Staff')
  @UseGuards(JwtAuthGuard, RbacGuard)
  warehouseStaffResource() {
    return {
      message: 'Warehouse Staff access granted',
    };
  }

  @Get('warehouse-manager')
  @Roles('Warehouse Manager')
  @UseGuards(JwtAuthGuard, RbacGuard)
  warehouseManagerResource() {
    return {
      message: 'Warehouse Manager access granted',
    };
  }

  @Get('management')
  @Roles('Management')
  @UseGuards(JwtAuthGuard, RbacGuard)
  managementResource() {
    return {
      message: 'Management access granted',
    };
  }

  @Get('warehouse-resource')
  @UseGuards(JwtAuthGuard, WarehouseScopeGuard)
  warehouseResource() {
    return {
      message: 'Warehouse scope access granted',
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
  controllers: [RbacRoleMatrixTestController],
})
class RbacRoleMatrixTestModule {}

describe('RBAC Role Matrix (e2e)', () => {
  let app: INestApplication;
  let moduleFixture: TestingModule;

  let rolesService: RolesService;
  let warehouseScopeService: WarehouseScopeService;
  let jwtService: JwtService;
  let db: Database;

  const tokens = new Map<string, string>();
  const warehouseScopes = new Map<string, string[]>();

  beforeAll(async () => {
    moduleFixture =
      await Test.createTestingModule({
        imports: [RbacRoleMatrixTestModule],
      }).compile();

    db = moduleFixture.get<Database>(DATABASE);

    rolesService =
      moduleFixture.get<RolesService>(
        RolesService,
      );

    warehouseScopeService =
      moduleFixture.get<WarehouseScopeService>(
        WarehouseScopeService,
      );

    jwtService =
      moduleFixture.get<JwtService>(
        JwtService,
      );

    app =
      moduleFixture.createNestApplication();

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

    for (const matrixUser of ROLE_MATRIX) {
      const [user] = await db
        .select({
          id: users.id,
          employeeCode: users.employeeCode,
          email: users.email,
        })
        .from(users)
        .where(
          eq(
            users.email,
            matrixUser.email,
          ),
        )
        .limit(1);

      expect(
        user,
        `Seed user not found: ${matrixUser.email}`,
      ).toBeDefined();

      if (!user) {
        throw new Error(
          `Seed user not found: ${matrixUser.email}`,
        );
      }

      expect(
        user.employeeCode,
        `Unexpected employee code for ${matrixUser.email}`,
      ).toBe(matrixUser.employeeCode);

      const userRoles =
        await rolesService.getRoleNamesByUserId(
          user.id,
        );

      expect(
        userRoles,
        `Unexpected roles for ${matrixUser.email}`,
      ).toEqual([matrixUser.role]);

      const warehouseIds =
        await warehouseScopeService.getWarehouseIdsByUserId(
          user.id,
        );

      expect(
        warehouseIds.length,
        `User has no warehouse scope: ${matrixUser.email}`,
      ).toBeGreaterThan(0);

      warehouseScopes.set(
        matrixUser.email,
        warehouseIds,
      );

      const token =
        await jwtService.signAsync({
          sub: user.id,
          employeeCode: user.employeeCode,
          email: user.email,
        });

      tokens.set(
        matrixUser.email,
        token,
      );
    }
  });

  afterAll(async () => {
    await app?.close();
  });

  describe('role matrix', () => {
    const endpointByRole: Record<
      RoleName,
      string
    > = {
      Admin:
        '/api/v1/test/rbac/admin',
      'Purchasing Staff':
        '/api/v1/test/rbac/purchasing',
      'Warehouse Staff':
        '/api/v1/test/rbac/warehouse-staff',
      'Warehouse Manager':
        '/api/v1/test/rbac/warehouse-manager',
      Management:
        '/api/v1/test/rbac/management',
    };

    for (const matrixUser of ROLE_MATRIX) {
      it(
        `${matrixUser.employeeCode} (${matrixUser.role}) should match the role matrix`,
        async () => {
          const token =
            tokens.get(matrixUser.email);

          expect(token).toBeDefined();

          if (!token) {
            throw new Error(
              `Token not generated for ${matrixUser.email}`,
            );
          }

          for (const requiredRole of ROLE_NAMES) {
            const expectedStatus =
              requiredRole === matrixUser.role
                ? 200
                : 403;

            await request(
              app.getHttpServer(),
            )
              .get(
                endpointByRole[requiredRole],
              )
              .set(
                'Authorization',
                `Bearer ${token}`,
              )
              .expect(expectedStatus);
          }
        },
      );
    }
  });

  describe('warehouse scope matrix', () => {
    for (const matrixUser of ROLE_MATRIX) {
      it(
        `${matrixUser.employeeCode} (${matrixUser.role}) should only access assigned warehouses`,
        async () => {
          const token =
            tokens.get(matrixUser.email);

          const warehouseIds =
            warehouseScopes.get(
              matrixUser.email,
            );

          expect(token).toBeDefined();

          expect(warehouseIds).toBeDefined();

          if (!token) {
            throw new Error(
              `Token not generated for ${matrixUser.email}`,
            );
          }

          if (!warehouseIds) {
            throw new Error(
              `Warehouse scope not loaded for ${matrixUser.email}`,
            );
          }

          for (const warehouseId of warehouseIds) {
            await request(
              app.getHttpServer(),
            )
              .get(
                `/api/v1/test/rbac/warehouse-resource?warehouseId=${warehouseId}`,
              )
              .set(
                'Authorization',
                `Bearer ${token}`,
              )
              .expect(200);
          }

          await request(
            app.getHttpServer(),
          )
            .get(
              `/api/v1/test/rbac/warehouse-resource?warehouseId=${OUTSIDE_WAREHOUSE_ID}`,
            )
            .set(
              'Authorization',
              `Bearer ${token}`,
            )
            .expect(403);
        },
      );
    }
  });
});