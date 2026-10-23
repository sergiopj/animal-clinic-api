import { ArgumentsHost, Catch, ExceptionFilter, HttpException } from '@nestjs/common';
import type { Request, Response } from 'express';

import { AppError, DuplicateKeyError } from './app-error.js';

interface MongoError extends Error {
  code?: number;
  keyPattern?: Record<string, number>;
  keyValue?: Record<string, unknown>;
}

@Catch()
export class ApiExceptionFilter implements ExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost): void {
    const context = host.switchToHttp();
    const response = context.getResponse<Response>();
    const request = context.getRequest<Request>();
    const error = exception instanceof Error ? exception : new Error('Unknown error');

    if (this.isMongoDuplicateError(exception)) {
      const field = exception.keyPattern ? Object.keys(exception.keyPattern)[0] : 'field';
      const value = exception.keyValue?.[field];
      this.sendAppError(response, request, new DuplicateKeyError(field, String(value)));
      return;
    }

    if (exception instanceof AppError) {
      this.sendAppError(response, request, exception);
      return;
    }

    if (exception instanceof HttpException) {
      const statusCode = exception.getStatus();
      const body = exception.getResponse() as string | Record<string, unknown>;
      const message =
        typeof body === 'string'
          ? body
          : Array.isArray(body['message'])
            ? body['message'].join(', ')
            : body['message'] || error.message;

      response.status(statusCode).json({ message });
      return;
    }

    console.error('API error', {
      message: error.message,
      stack: error.stack,
      url: request.url,
      method: request.method,
      ip: request.ip,
    });
    response.status(500).json({ status: 'error', message: 'Internal server error' });
  }

  private isMongoDuplicateError(error: unknown): error is MongoError {
    return error instanceof Error && 'code' in error && error.code === 11000;
  }

  private sendAppError(response: Response, request: Request, error: AppError): void {
    if (!error.isOperational || error.statusCode >= 500) {
      console.error('API error', {
        message: error.message,
        stack: error.stack,
        url: request.url,
        method: request.method,
        ip: request.ip,
      });
    }

    const body: Record<string, unknown> = {
      status: error.statusCode >= 500 ? 'error' : 'fail',
      message: error.message,
    };

    if (error instanceof AppError && 'errors' in error && Array.isArray(error.errors)) {
      body.errors = error.errors;
    }

    if (process.env.NODE_ENV === 'development' && error.stack) {
      body.stack = error.stack;
    }

    response.status(error.statusCode).json(body);
  }
}
