import {
  describe,
  expect,
  it,
  vi,
} from 'vitest';

import { UnauthorizedException } from '@nestjs/common';

import { AuthService } from './auth.service.js';

describe('AuthService', () => {
  const passwordService = {
    compare: vi.fn(),
  };

  const db = {
    select: vi.fn(),
  };

  const authService = new AuthService(
    db as never,
    passwordService as never,
  );

  it('should validate an active user with correct password', async () => {
    passwordService.compare.mockResolvedValue(true);

    db.select.mockReturnValue({
      from: vi.fn().mockReturnValue({
        where: vi.fn().mockReturnValue({
          limit: vi.fn().mockResolvedValue([
            {
              id: 'user-id',
              employeeCode: 'EMP-0001',
              name: 'System Administrator',
              email: 'admin@sinar-distribusi.local',
              passwordHash: 'hashed-password',
              status: 'ACTIVE',
            },
          ]),
        }),
      }),
    });

    const result =
      await authService.validateUser({
        email: 'admin@sinar-distribusi.local',
        password: 'ValidPassword123!',
      });

    expect(result).toEqual({
      id: 'user-id',
      employeeCode: 'EMP-0001',
      name: 'System Administrator',
      email: 'admin@sinar-distribusi.local',
      status: 'ACTIVE',
    });

    expect(passwordService.compare).toHaveBeenCalledWith(
      'ValidPassword123!',
      'hashed-password',
    );
  });

  it('should reject unknown user', async () => {
    db.select.mockReturnValue({
      from: vi.fn().mockReturnValue({
        where: vi.fn().mockReturnValue({
          limit: vi.fn().mockResolvedValue([]),
        }),
      }),
    });

    await expect(
      authService.validateUser({
        email: 'unknown@sinar-distribusi.local',
        password: 'WrongPassword123!',
      }),
    ).rejects.toThrow(UnauthorizedException);
  });

  it('should reject inactive user', async () => {
    db.select.mockReturnValue({
      from: vi.fn().mockReturnValue({
        where: vi.fn().mockReturnValue({
          limit: vi.fn().mockResolvedValue([
            {
              id: 'user-id',
              employeeCode: 'EMP-0001',
              name: 'System Administrator',
              email: 'admin@sinar-distribusi.local',
              passwordHash: 'hashed-password',
              status: 'INACTIVE',
            },
          ]),
        }),
      }),
    });

    await expect(
      authService.validateUser({
        email: 'admin@sinar-distribusi.local',
        password: 'ValidPassword123!',
      }),
    ).rejects.toThrow(UnauthorizedException);
  });

  it('should reject incorrect password', async () => {
    passwordService.compare.mockResolvedValue(false);

    db.select.mockReturnValue({
      from: vi.fn().mockReturnValue({
        where: vi.fn().mockReturnValue({
          limit: vi.fn().mockResolvedValue([
            {
              id: 'user-id',
              employeeCode: 'EMP-0001',
              name: 'System Administrator',
              email: 'admin@sinar-distribusi.local',
              passwordHash: 'hashed-password',
              status: 'ACTIVE',
            },
          ]),
        }),
      }),
    });

    await expect(
      authService.validateUser({
        email: 'admin@sinar-distribusi.local',
        password: 'WrongPassword123!',
      }),
    ).rejects.toThrow(UnauthorizedException);
  });
});