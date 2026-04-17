export interface ApiError {
  code: string;
  message: string;
  details: Record<string, unknown> | null;
}

export interface ApiResponse<T> {
  data: T | null;
  meta: Record<string, unknown> | null;
  error: ApiError | null;
}