import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { Observable, map } from 'rxjs';
import { ApiResponse } from '../types/api-response.type';

@Injectable()
export class ApiResponseInterceptor<T>
  implements NestInterceptor<T, ApiResponse<T>>
{
  intercept(
    _context: ExecutionContext,
    next: CallHandler<T>,
  ): Observable<ApiResponse<T>> {
    return next.handle().pipe(
      map((value) => {
        if (
          typeof value === 'object' &&
          value !== null &&
          'data' in value &&
          'meta' in value &&
          'error' in value
        ) {
          return value as ApiResponse<T>;
        }

        return {
          data: value,
          meta: null,
          error: null,
        };
      }),
    );
  }
}