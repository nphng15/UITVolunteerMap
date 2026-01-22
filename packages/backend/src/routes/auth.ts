import { Router } from 'express';
import type { ApiResponse } from '@uit-volunteer-map/shared';
import { validate } from '../middleware/validate.js';
import { loginSchema } from '../schemas/auth.js';
import { AuthService } from '../service/authService.js';
import dotenv from "dotenv";
dotenv.config();

const router = Router();
const authService = new AuthService();
router.post('/login', validate(loginSchema), async (req, res) => {
  try {
    const result = await authService.login(req.body);
    res.json(result);
  } catch (error: any) {
    res.status(401).json({ message: error.message });
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
