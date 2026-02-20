import { Request, Response, NextFunction } from 'express';
import { AppError } from './app-error.js';

interface ErrorResponse {
  status: 'error' | 'fail';
  message: string;
  errors?: unknown[];
  stack?: string;
}

/**
 * Global Error Handler Middleware
 * Must be placed after all routes
 */
export const errorHandler = (
  err: Error | AppError,
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  // Default error values
  let statusCode = 500;
  let message = 'Internal server error';
  let isOperational = false;
  let errors: unknown[] | undefined;

  // Handle known AppError instances
  if (err instanceof AppError) {
    statusCode = err.statusCode;
    message = err.message;
    isOperational = err.isOperational;
    if ('errors' in err && Array.isArray(err.errors)) {
      errors = err.errors;
    }
  }

  // Log error for monitoring
  if (!isOperational || statusCode >= 500) {
    console.error('❌ Error:', {
      message: err.message,
      stack: err.stack,
      url: req.url,
      method: req.method,
      ip: req.ip,
    });
  }

  // Build error response
  const response: ErrorResponse = {
    status: statusCode >= 500 ? 'error' : 'fail',
    message,
  };

  // Add validation errors if present
  if (errors) {
    response.errors = errors;
  }

  // Add stack trace in development
  if (process.env.NODE_ENV === 'development' && err.stack) {
    response.stack = err.stack;
  }

  res.status(statusCode).json(response);
};
