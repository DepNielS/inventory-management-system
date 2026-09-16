import type {
  PaginationMeta,
  PaginationParams,
} from './pagination.types.js';

export function createPaginationMeta(
  params: PaginationParams,
  total: number,
): PaginationMeta {
  const totalPages =
    params.limit > 0
      ? Math.ceil(total / params.limit)
      : 0;

  return {
    page: params.page,
    limit: params.limit,
    total,
    totalPages,
  };
}

export function calculatePaginationOffset(
  params: PaginationParams,
): number {
  return (params.page - 1) * params.limit;
}