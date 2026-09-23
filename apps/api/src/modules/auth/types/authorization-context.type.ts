import type { AuthenticatedUser } from './authenticated-user.type.js';

export interface AuthorizationContext {
  user: AuthenticatedUser;
  roles: string[];
  permissions: string[];
}