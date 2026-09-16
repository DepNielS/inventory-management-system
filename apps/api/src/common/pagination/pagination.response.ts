import type {
  PaginatedResult,
} from './pagination.types.js';

export interface PaginatedResponse<T> {
  success: true;
  statusCode: number;
  message: string;
  data: T[];
  timestamp: string;
  path: string;
  requestId?: string;
  meta: PaginatedResult<T>['meta'];
}