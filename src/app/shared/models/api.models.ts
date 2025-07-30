/**
 * API related models and interfaces
 */

export interface ApiResponse<T = unknown> {
  data: T;
  success: boolean;
  message?: string;
  timestamp: number;
  requestId?: string;
}

export interface PaginatedResponse<T = unknown> {
  data: T[];
  pagination: PaginationInfo;
  success: boolean;
  message?: string;
  timestamp: number;
}

export interface PaginationInfo {
  currentPage: number;
  totalPages: number;
  totalItems: number;
  itemsPerPage: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
}

export interface ApiError {
  code: string;
  message: string;
  details?: Record<string, unknown>;
  field?: string;
  timestamp: number;
  path?: string;
  method?: string;
}

export interface ApiErrorResponse {
  error: ApiError;
  errors?: ApiError[];
  success: false;
  timestamp: number;
  requestId?: string;
}

export interface SortOptions {
  field: string;
  direction: 'asc' | 'desc';
}

export interface FilterOptions {
  field: string;
  operator:
    | 'eq'
    | 'ne'
    | 'gt'
    | 'gte'
    | 'lt'
    | 'lte'
    | 'contains'
    | 'startsWith'
    | 'endsWith';
  value: unknown;
}

export interface QueryOptions {
  page?: number;
  limit?: number;
  sort?: SortOptions[];
  filters?: FilterOptions[];
  search?: string;
  fields?: string[];
}

export interface HttpRequestOptions {
  headers?: Record<string, string>;
  params?: Record<string, string | number | boolean>;
  timeout?: number;
  retries?: number;
  cache?: boolean;
  skipErrorHandling?: boolean;
}

export type HttpMethod = 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';

export interface RequestLog {
  id: string;
  method: HttpMethod;
  url: string;
  headers: Record<string, string>;
  body?: unknown;
  timestamp: number;
  duration?: number;
  status?: number;
  error?: string;
}
