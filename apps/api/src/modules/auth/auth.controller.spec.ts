import { describe, expect, it, vi } from 'vitest';

import { AuthController } from './auth.controller.js';
import type { AuthService } from './auth.service.js';

describe('AuthController', () => {
  it('should login successfully', async () => {
    const authService = {
      login: vi.fn().mockResolvedValue({
        accessToken: 'test-access-token',
      }),
    } as unknown as AuthService;

    const controller = new AuthController(authService);

    const result = await controller.login({
      email: 'admin@example.com',
      password: 'password',
    });

    expect(authService.login).toHaveBeenCalledWith({
      email: 'admin@example.com',
      password: 'password',
    });

    expect(result).toEqual({
      accessToken: 'test-access-token',
    });
  });
});