import { describe, expect, it } from 'vitest';

import {
  ROLES_KEY,
  Roles,
} from './roles.decorator.js';

describe('Roles decorator', () => {
  it('should store required roles as metadata', () => {
    class TestController {
      @Roles('Admin', 'Warehouse Manager')
      testEndpoint() {
        return true;
      }
    }

    const metadata = Reflect.getMetadata(
      ROLES_KEY,
      TestController.prototype.testEndpoint,
    );

    expect(metadata).toEqual([
      'Admin',
      'Warehouse Manager',
    ]);
  });

  it('should store a single role as metadata', () => {
    class TestController {
      @Roles('Admin')
      testEndpoint() {
        return true;
      }
    }

    const metadata = Reflect.getMetadata(
      ROLES_KEY,
      TestController.prototype.testEndpoint,
    );

    expect(metadata).toEqual(['Admin']);
  });
});