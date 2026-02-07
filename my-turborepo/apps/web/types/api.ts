/**
 * API Response Types
 * 
 * Standardized response types for API routes.
 * Provides consistent error handling and success responses.
 * 
 * @module types/api
 */

// Generic API response wrapper
export interface ApiResponse<T = unknown> {
    success: boolean;
    data?: T;
    error?: ApiError;
    meta?: ApiMeta;
}

export interface ApiError {
    code: string;
    message: string;
    details?: Record<string, unknown>;
}

export interface ApiMeta {
    total?: number;
    page?: number;
    limit?: number;
    hasMore?: boolean;
}

// Pagination params
export interface PaginationParams {
    page?: number;
    limit?: number;
    sortBy?: string;
    sortOrder?: 'asc' | 'desc';
}

// Common error codes
export const ERROR_CODES = {
    // Auth errors
    UNAUTHORIZED: 'UNAUTHORIZED',
    FORBIDDEN: 'FORBIDDEN',
    INVALID_CREDENTIALS: 'INVALID_CREDENTIALS',
    SESSION_EXPIRED: 'SESSION_EXPIRED',

    // Validation errors
    VALIDATION_ERROR: 'VALIDATION_ERROR',
    INVALID_INPUT: 'INVALID_INPUT',
    MISSING_REQUIRED_FIELD: 'MISSING_REQUIRED_FIELD',

    // Resource errors
    NOT_FOUND: 'NOT_FOUND',
    ALREADY_EXISTS: 'ALREADY_EXISTS',
    CONFLICT: 'CONFLICT',

    // Server errors
    INTERNAL_ERROR: 'INTERNAL_ERROR',
    DATABASE_ERROR: 'DATABASE_ERROR',
    EXTERNAL_API_ERROR: 'EXTERNAL_API_ERROR',
    RATE_LIMITED: 'RATE_LIMITED',
} as const;

export type ErrorCode = typeof ERROR_CODES[keyof typeof ERROR_CODES];

/**
 * Create a success response
 */
export function successResponse<T>(data: T, meta?: ApiMeta): ApiResponse<T> {
    return {
        success: true,
        data,
        ...(meta && { meta }),
    };
}

/**
 * Create an error response
 */
export function errorResponse(
    code: ErrorCode,
    message: string,
    details?: Record<string, unknown>
): ApiResponse<never> {
    return {
        success: false,
        error: {
            code,
            message,
            ...(details && { details }),
        },
    };
}
