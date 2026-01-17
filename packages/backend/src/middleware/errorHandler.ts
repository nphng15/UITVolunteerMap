import type { Request, Response, NextFunction } from 'express';
import { HTTP_STATUS, type ApiResponse } from '@uit-volunteer-map/shared';

export interface AppError extends Error {
  statusCode?: number;
}

export const errorHandler = (
  err: AppError,
  _req: Request,
  res: Response,
  _next: NextFunction
) => {
  const statusCode = err.statusCode || HTTP_STATUS.INTERNAL_SERVER_ERROR;

  const response: ApiResponse<null> = {
    success: false,
    error: err.message || 'Internal Server Error',
  };

  console.error(`[Error] ${err.message}`, err.stack);

  res.status(statusCode).json(response);
};
