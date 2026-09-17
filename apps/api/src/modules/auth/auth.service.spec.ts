import { JwtService } from '@nestjs/jwt';
import { describe, beforeEach, expect, it, vi } from 'vitest';
import { UnauthorizedException } from '@nestjs/common';

import { AuthService } from './auth.service.js';
import { PasswordService } from './password.service.js';

describe('AuthService', () => {
  const db = {
    select: vi.fn(),
  };

  let from: ReturnType<typeof vi.fn>;
  let where: ReturnType<typeof vi.fn>;
  let limit: ReturnType<typeof vi.fn>;

  let passwordService: PasswordService;
  let jwtService: JwtService;
  let authService: AuthService;

  beforeEach(() => {
    limit = vi.fn();
    where = vi.fn(() => ({
      limit,
    }));
    from = vi.fn(() => ({
      where,
    }));

    db.select.mockReturnValue({
      from,
    });

    passwordService = new PasswordService();

    vi.spyOn(passwordService, 'compare');

    jwtService = {
      signAsync: vi.fn(),
    } as unknown as JwtService;

    authService = new AuthService(
      db as any,
      passwordService,
      jwtService,
    );
  });

  it('should validate active user with correct password', async () => {
    const user = {
      id: 'user-001',
      employeeCode: 'EMP-0001',
      name: 'System Administrator',
      email: 'admin@sinar-distribusi.local',
      passwordHash: 'hashed-password',
      status: 'ACTIVE' as const,
    };

    limit.mockResolvedValue([user]);
    vi.mocked(passwordService.compare).mockResolvedValue(true);

    const result = await authService.validateUser({
      email: user.email,
      password: 'correct-password',
    });

    expect(passwordService.compare).toHaveBeenCalledWith(
      'correct-password',
      'hashed-password',
    );

    expect(result).toEqual({
      id: user.id,
      employeeCode: user.employeeCode,
      name: user.name,
      email: user.email,
      status: user.status,
    });
  });

  it('should reject unknown user', async () => {
    limit.mockResolvedValue([]);

    await expect(
      authService.validateUser({
        email: 'unknown@sinar-distribusi.local',
        password: 'password',
      }),
    ).rejects.toThrowError(
      new UnauthorizedException('Invalid email or password.'),
    );

    expect(passwordService.compare).not.toHaveBeenCalled();
  });

  it('should reject inactive user', async () => {
    const user = {
      id: 'user-002',
      employeeCode: 'EMP-0002',
      name: 'Inactive User',
      email: 'inactive@sinar-distribusi.local',
      passwordHash: 'hashed-password',
      status: 'INACTIVE' as const,
    };

    limit.mockResolvedValue([user]);

    await expect(
      authService.validateUser({
        email: user.email,
        password: 'password',
      }),
    ).rejects.toThrowError(
      new UnauthorizedException('Invalid email or password.'),
    );

    expect(passwordService.compare).not.toHaveBeenCalled();
  });

  it('should reject incorrect password', async () => {
    const user = {
      id: 'user-001',
      employeeCode: 'EMP-0001',
      name: 'System Administrator',
      email: 'admin@sinar-distribusi.local',
      passwordHash: 'hashed-password',
      status: 'ACTIVE' as const,
    };

    limit.mockResolvedValue([user]);
    vi.mocked(passwordService.compare).mockResolvedValue(false);

    await expect(
      authService.validateUser({
        email: user.email,
        password: 'wrong-password',
      }),
    ).rejects.toThrowError(
      new UnauthorizedException('Invalid email or password.'),
    );
  });

  it('should login successfully and return access token', async () => {
    const user = {
      id: 'user-001',
      employeeCode: 'EMP-0001',
      name: 'System Administrator',
      email: 'admin@sinar-distribusi.local',
      status: 'ACTIVE' as const,
    };

    vi.spyOn(authService, 'validateUser').mockResolvedValue(user);

    vi.mocked(jwtService.signAsync).mockResolvedValue(
      'test-access-token',
    );

    const result = await authService.login({
      email: user.email,
      password: 'correct-password',
    });

    expect(authService.validateUser).toHaveBeenCalledWith({
      email: user.email,
      password: 'correct-password',
    });

    expect(jwtService.signAsync).toHaveBeenCalledWith({
      sub: user.id,
      employeeCode: user.employeeCode,
      email: user.email,
    });

    expect(result).toEqual({
      accessToken: 'test-access-token',
    });
  });
});