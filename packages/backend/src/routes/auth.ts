import { Router } from 'express';
import type { ApiResponse, LoginResponse } from '@uit-volunteer-map/shared';
import { HTTP_STATUS, ERROR_MESSAGES, SUCCESS_MESSAGES } from '@uit-volunteer-map/shared';
import { validate } from '../middleware/validate.js';
import { loginSchema } from '../schemas/auth.js';
import { AuthService } from '../service/authService.js';
import { HttpError } from '../errors/HttpError.js';

const router = Router();
const authService = new AuthService();

router.post('/login', validate(loginSchema), async (req, res) => {
  try {
    const result = await authService.login(req.body);
    const response: ApiResponse<LoginResponse> = {
      success: true,
      data: result,
    };
    res.status(HTTP_STATUS.OK).json(response);
  } catch (err: unknown) {
    if (err instanceof HttpError) {
      const response: ApiResponse<null> = {
        success: false,
        error: err.message,
      };
      return res.status(err.statusCode).json(response);
    }
    const response: ApiResponse<null> = {
      success: false,
      error: ERROR_MESSAGES.INTERNAL_SERVER_ERROR,
    };
    res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json(response);
  }
});

router.post('/logout', (_req, res) => {
  const response: ApiResponse<null> = {
    success: true,
    data: null,
    message: SUCCESS_MESSAGES.LOGGED_OUT,
  };
  res.status(HTTP_STATUS.OK).json(response);
});

export { router as authRouter };
