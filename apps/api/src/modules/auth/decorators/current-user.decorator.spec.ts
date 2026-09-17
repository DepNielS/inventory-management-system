import { describe, expect, it } from 'vitest';
import type { ExecutionContext } from '@nestjs/common';

import { currentUserFactory } from './current-user.decorator.js';
import type { AuthenticatedUser } from '../types/authenticated-user.type.js';

describe('CurrentUser', () => {
  it('should return authenticated user from request', () => {
    const user: AuthenticatedUser = {
      id: 'user-001',
      employeeCode: 'EMP-0001',
      email: 'admin@example.com',
    };

    const request = {
      user,
    };

    const context = {
      switchToHttp: () => ({
        getRequest: () => request,
      }),
    } as unknown as ExecutionContext;

    const result = currentUserFactory(undefined, context);

    expect(result).toEqual(user);
  });
});