import { z } from 'zod';
import type { LoginRequest } from '@uit-volunteer-map/shared';

export const loginSchema = z.object({
  username: z.string().trim().min(1, 'Username is required'),
  password: z.string().min(1, 'Password is required'),
}) satisfies z.ZodType<LoginRequest>;

export type LoginInput = z.infer<typeof loginSchema>;
