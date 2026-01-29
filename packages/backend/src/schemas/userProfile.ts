import { z } from 'zod';

const baseUserProfileSchema = z.object({
  FullName: z.string().min(1, 'FullName is required'),
  Mssv: z.string().min(1, 'Mssv is required'),
  Class: z.string().min(1, 'Class is required'),
  Email: z.string().email('Invalid email format'),
  PhoneNumber: z.string().min(10, 'PhoneNumber must be at least 10 digits'),
});

export const updateUserProfileSchema = baseUserProfileSchema.partial();

export type UpdateUserProfileInput = z.infer<typeof updateUserProfileSchema>;
