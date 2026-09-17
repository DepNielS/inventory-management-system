import {
  createParamDecorator,
  type ExecutionContext,
} from '@nestjs/common';

import type { AuthenticatedUser } from '../types/authenticated-user.type.js';

export function currentUserFactory(
  _data: unknown,
  context: ExecutionContext,
): AuthenticatedUser {
  const request = context.switchToHttp().getRequest<{
    user: AuthenticatedUser;
  }>();

  return request.user;
}

export const CurrentUser = createParamDecorator(currentUserFactory);