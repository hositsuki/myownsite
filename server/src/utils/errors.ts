export class BaseError extends Error {
  constructor(
    public message: string,
    public statusCode: number = 500,
    public code: string = 'INTERNAL_SERVER_ERROR'
  ) {
    super(message);
    this.name = this.constructor.name;
    Error.captureStackTrace(this, this.constructor);
  }
}

export class ValidationError extends BaseError {
  constructor(message: string) {
    super(message, 400, 'VALIDATION_ERROR');
  }
}

export class AuthError extends BaseError {
  constructor(message: string) {
    super(message, 401, 'AUTH_ERROR');
  }
}

export class ForbiddenError extends BaseError {
  constructor(message: string) {
    super(message, 403, 'FORBIDDEN_ERROR');
  }
}

export class NotFoundError extends BaseError {
  constructor(message: string) {
    super(message, 404, 'NOT_FOUND_ERROR');
  }
}

export class ConflictError extends BaseError {
  constructor(message: string) {
    super(message, 409, 'CONFLICT_ERROR');
  }
}

export class RateLimitError extends BaseError {
  constructor(message: string) {
    super(message, 429, 'RATE_LIMIT_ERROR');
  }
}

export class DatabaseError extends BaseError {
  constructor(message: string) {
    super(message, 500, 'DATABASE_ERROR');
  }
}

export class ExternalServiceError extends BaseError {
  constructor(message: string) {
    super(message, 502, 'EXTERNAL_SERVICE_ERROR');
  }
}
