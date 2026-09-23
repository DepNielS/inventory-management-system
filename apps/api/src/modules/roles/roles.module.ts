import { Module } from '@nestjs/common';

import { PermissionsModule } from '../permissions/permissions.module.js';
import { RbacGuard } from './guards/rbac.guard.js';
import { RolesService } from './roles.service.js';

@Module({
  imports: [
    PermissionsModule,
  ],

  providers: [
    RolesService,
    RbacGuard,
  ],

  exports: [
    RolesService,
    RbacGuard,
  ],
})
export class RolesModule {}