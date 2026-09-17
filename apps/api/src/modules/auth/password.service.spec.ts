import { describe, expect, it } from 'vitest';

import { PasswordService } from './password.service.js';

describe('PasswordService', () => {
  const passwordService =
    new PasswordService();

  it('should hash a password', async () => {
    const password = 'TestPassword123!';

    const passwordHash =
      await passwordService.hash(password);

    expect(passwordHash).toBeDefined();
    expect(passwordHash).not.toBe(password);
    expect(passwordHash).toMatch(
      /^\$2[aby]\$/,
    );
  });

  it('should return true for matching password', async () => {
    const password = 'TestPassword123!';

    const passwordHash =
      await passwordService.hash(password);

    const result =
      await passwordService.compare(
        password,
        passwordHash,
      );

    expect(result).toBe(true);
  });

  it('should return false for incorrect password', async () => {
    const password =
      'TestPassword123!';

    const wrongPassword =
      'WrongPassword123!';

    const passwordHash =
      await passwordService.hash(password);

    const result =
      await passwordService.compare(
        wrongPassword,
        passwordHash,
      );

    expect(result).toBe(false);
  });
});