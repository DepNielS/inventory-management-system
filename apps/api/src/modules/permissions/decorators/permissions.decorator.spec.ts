import { describe, expect, it } from 'vitest';

import {
  PERMISSIONS_KEY,
  Permissions,
} from './permissions.decorator.js';

describe('Permissions decorator', () => {
  it('should store required permissions as metadata', () => {
    class TestController {
      @Permissions('product.read', 'product.create')
      testEndpoint() {
        return true;
      }
    }

    const metadata = Reflect.getMetadata(
      PERMISSIONS_KEY,
      TestController.prototype.testEndpoint,
    );

    expect(metadata).toEqual([
      'product.read',
      'product.create',
    ]);
  });

  it('should store a single permission as metadata', () => {
    class TestController {
      @Permissions('product.read')
      testEndpoint() {
        return true;
      }
    }

    const metadata = Reflect.getMetadata(
      PERMISSIONS_KEY,
      TestController.prototype.testEndpoint,
    );

    expect(metadata).toEqual([
      'product.read',
    ]);
  });
});