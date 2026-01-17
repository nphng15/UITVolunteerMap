import { Router } from 'express';
import type { ApiResponse, User } from '@uit-volunteer-map/shared';
import { validate } from '../middleware/validate.js';
import { loginSchema, type LoginInput } from '../schemas/auth.js';

const router = Router();

// Mock users - replace with database
const MOCK_USERS: (User & { password: string })[] = [
  {
    id: '1',
    email: 'admin@example.com',
    password: 'admin123',
    name: 'Admin User',
    role: 'admin',
  },
  {
    id: '2',
    email: 'user@example.com',
    password: 'user123',
    name: 'Normal User',
    role: 'user',
  },
];

router.post('/login', validate(loginSchema), (req, res) => {
  const { email, password } = req.body as LoginInput;

  const user = MOCK_USERS.find(
    (u) => u.email === email && u.password === password
  );

  if (!user) {
    const response: ApiResponse<null> = {
      success: false,
      error: 'Invalid email or password',
    };
    res.status(401).json(response);
    return;
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { password: _, ...userWithoutPassword } = user;

  const response: ApiResponse<{ user: User }> = {
    success: true,
    data: { user: userWithoutPassword },
    message: 'Login successful',
  };

  res.json(response);
});

router.post('/logout', (_req, res) => {
  const response: ApiResponse<null> = {
    success: true,
    message: 'Logged out successfully',
  };
  res.json(response);
});

export { router as authRouter };
