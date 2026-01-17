import type { Request, Response, NextFunction } from 'express';
import type { ZodSchema } from 'zod';
import type { ApiResponse } from '@uit-volunteer-map/shared';

export function validate<T>(schema: ZodSchema<T>) {
  return (req: Request, res: Response, next: NextFunction) => {
    const result = schema.safeParse(req.body);

    if (!result.success) {
      const errors = result.error.issues
        .map((e) => `${e.path.join('.') || 'field'}: ${e.message}`)
        .join(', ');

      const response: ApiResponse<null> = {
        success: false,
        error: 'Validation failed',
        message: errors,
      };
      res.status(400).json(response);
      return;
    }

    req.body = result.data;
    next();
  };
}
