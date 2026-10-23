export interface PaginatedResponseDTO<T> {
  data: T[];
  pagination: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
    hasNextPage: boolean;
    hasPreviousPage: boolean;
  };
}

export interface CursorPaginatedResponseDTO<T> {
  data: T[];
  pagination: {
    nextCursor: string | null;
    previousCursor: string | null;
    hasNextPage: boolean;
    hasPreviousPage: boolean;
    total?: number;
  };
}

export function transformPaginatedResponse<TSource, TDest>(
  response: PaginatedResponseDTO<TSource>,
  mapper: (item: TSource) => TDest
): PaginatedResponseDTO<TDest> {
  return {
    data: response.data.map(mapper),
    pagination: response.pagination,
  };
}

export function transformCursorPaginatedResponse<TSource, TDest>(
  response: CursorPaginatedResponseDTO<TSource>,
  mapper: (item: TSource) => TDest
): CursorPaginatedResponseDTO<TDest> {
  return {
    data: response.data.map(mapper),
    pagination: response.pagination,
  };
}
