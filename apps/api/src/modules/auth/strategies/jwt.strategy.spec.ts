import {
  describe,
  expect,
  it,
  vi,
} from 'vitest';

import { JwtStrategy } from './jwt.strategy.js';

describe('JwtStrategy', () => {
  const configService = {
    getOrThrow: vi.fn().mockReturnValue(
      'test-secret',
    ),
  };

  const strategy = new JwtStrategy(
    configService as never,
  );

  it('should transform JWT payload into current user', () => {
    const result = strategy.validate({
      sub: 'user-id',
      employeeCode: 'EMP-0001',
      email: 'admin@sinar-distribusi.local',
    });

    expect(result).toEqual({
      id: 'user-id',
      employeeCode: 'EMP-0001',
      email: 'admin@sinar-distribusi.local',
    });
  });
});