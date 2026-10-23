/**
 * Base Application Error
 */
export class AppError extends Error {
  constructor(
    public statusCode: number,
    public message: string,
    public isOperational: boolean = true
  ) {
    super(message);
    Object.setPrototypeOf(this, AppError.prototype);
    Error.captureStackTrace(this, this.constructor);
  }
}

/**
 * 404 Not Found Error
 */
export class NotFoundError extends AppError {
  constructor(resource: string = 'Resource') {
    super(404, `${resource} not found`);
  }
}

/**
 * 400 Bad Request Error
 */
export class BadRequestError extends AppError {
  constructor(message: string = 'Bad request') {
    super(400, message);
  }
}

/**
 * 401 Unauthorized Error
 */
export class UnauthorizedError extends AppError {
  constructor(message: string = 'Unauthorized') {
    super(401, message);
  }
}

/**
 * 403 Forbidden Error
 */
export class ForbiddenError extends AppError {
  constructor(message: string = 'Forbidden') {
    super(403, message);
  }
}

/**
 * 422 Validation Error
 */
export class ValidationError extends AppError {
  constructor(
    message: string = 'Validation failed',
    public errors?: unknown[]
  ) {
    super(422, message);
  }
}

/**
 * 409 Conflict Error (e.g., duplicate unique key)
 */
export class DuplicateKeyError extends AppError {
  constructor(field: string, value?: string) {
    const message = value ? `${field} '${value}' already exists` : `Duplicate value for ${field}`;
    super(409, message);
  }
}

/**
 * 500 Internal Server Error
 */
export class InternalServerError extends AppError {
  constructor(message: string = 'Internal server error') {
    super(500, message, false); // Not operational
  }
}
