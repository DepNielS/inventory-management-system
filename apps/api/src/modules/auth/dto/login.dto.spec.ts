import { describe, expect, it } from 'vitest';
import {
  validate,
} from 'class-validator';
import {
  plainToInstance,
} from 'class-transformer';

import { LoginDto } from './login.dto.js';

describe('LoginDto', () => {
  it('should accept valid login credentials', async () => {
    const dto = plainToInstance(LoginDto, {
      email: 'admin@sinar-distribusi.local',
      password: 'ValidPassword123!',
    });

    const errors = await validate(dto);

    expect(errors).toHaveLength(0);
  });

  it('should reject invalid email', async () => {
    const dto = plainToInstance(LoginDto, {
      email: 'invalid-email',
      password: 'ValidPassword123!',
    });

    const errors = await validate(dto);

    expect(errors.length).toBeGreaterThan(0);
  });

  it('should reject empty password', async () => {
    const dto = plainToInstance(LoginDto, {
      email: 'admin@sinar-distribusi.local',
      password: '',
    });

    const errors = await validate(dto);

    expect(errors.length).toBeGreaterThan(0);
  });
});