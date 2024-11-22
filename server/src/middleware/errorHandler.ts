import { Request, Response, NextFunction } from 'express';
import { ApiError } from '../core/ApiError';
import { ApiResponse } from '../core/ApiResponse';
import { logger } from '../utils/logger';

export const errorHandler = (
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (err instanceof ApiError) {
    if (err.isOperational) {
      return res
        .status(err.statusCode)
        .json(ApiResponse.error(err.message, err.statusCode));
    }
    return res.status(500).json(ApiResponse.error('Internal Server Error'));
  }

  // Log unexpected errors
  logger.error('Unexpected Error:', {
    error: err.message,
    stack: err.stack,
    path: req.path,
    method: req.method,
  });

  return res.status(500).json(ApiResponse.error('Internal Server Error'));
};
