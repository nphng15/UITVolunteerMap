import { Router } from 'express';
import type { ApiResponse, LoginResponse } from '@uit-volunteer-map/shared';
import { validate } from '../middleware/validate.js';
import { loginSchema } from '../schemas/auth.js';
import { AuthService } from '../service/authService.js';

const router = Router();
const authService = new AuthService();

router.post('/login', validate(loginSchema), async (req, res) => {
  try {
    const result = await authService.login(req.body);
    const response: ApiResponse<LoginResponse> = {
      success: true,
      data: result,
    };
    res.json(response);
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Login failed';
    const response: ApiResponse<null> = {
      success: false,
      error: message,
    };
    res.status(401).json(response);
  }
});

router.post('/logout', (_req, res) => {
  const response: ApiResponse<null> = {
    success: true,
    message: 'Logged out successfully',
  };
  res.json(response);
});

export { router as authRouter };
