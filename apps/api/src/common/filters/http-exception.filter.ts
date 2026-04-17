import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { ApiError, ApiResponse } from '../types/api-response.type';

@Catch()
export class HttpExceptionFilter implements ExceptionFilter {
  private readonly logger = new Logger(HttpExceptionFilter.name);

  catch(exception: unknown, host: ArgumentsHost): void {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    const status =
      exception instanceof HttpException
        ? exception.getStatus()
        : HttpStatus.INTERNAL_SERVER_ERROR;

    const exceptionResponse =
      exception instanceof HttpException ? exception.getResponse() : null;

    const payload = this.formatError(status, exceptionResponse);
    const body: ApiResponse<null> = {
      data: null,
      meta: null,
      error: payload,
    };

    if (status >= HttpStatus.INTERNAL_SERVER_ERROR) {
      this.logger.error(
        `${request.method} ${request.url} failed with ${status}`,
        exception instanceof Error ? exception.stack : undefined,
      );
    }

    response.status(status).json(body);
  }

  private formatError(status: number, response: unknown): ApiError {
    if (typeof response === 'string') {
      return {
        code: `HTTP_${status}`,
        message: response,
        details: null,
      };
    }

    if (typeof response === 'object' && response !== null) {
      const safeResponse = response as Record<string, unknown>;
      const messageRaw = safeResponse.message;
      const message = Array.isArray(messageRaw)
        ? messageRaw.join(', ')
        : typeof messageRaw === 'string'
          ? messageRaw
          : 'Request failed';

      const code =
        typeof safeResponse.code === 'string'
          ? safeResponse.code
          : `HTTP_${status}`;

      const details =
        typeof safeResponse.details === 'object' && safeResponse.details !== null
          ? safeResponse.details
          : safeResponse;

      return {
        code,
        message,
        details,
      };
    }

    return {
      code: `HTTP_${status}`,
      message: 'Internal server error',
      details: null,
    };
  }
}