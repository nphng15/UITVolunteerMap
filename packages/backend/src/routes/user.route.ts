import { Router } from 'express';
import { RoleEnum } from '@uit-volunteer-map/shared';
import { authenticateToken, requireRole } from '../middleware/auth.js';
import { updateUserProfileSchema } from '../schemas/userProfile.js';
import { UserProfileService } from '../service/userProfileService.js';

const router = Router();
const service = new UserProfileService();

const ALLOWED_KEYS = new Set(['FullName', 'Mssv', 'Class', 'Email', 'PhoneNumber']);

function forbidden(body: unknown): boolean {
  if (!body || typeof body !== 'object') return false;
  const keys = Object.keys(body as Record<string, unknown>);
  const lowered = keys.map((k) => k.toLowerCase());
  if (lowered.includes('userid') || lowered.includes('role')) return true;
  return keys.some((k) => !ALLOWED_KEYS.has(k));
}

router.get(
  '/profile',
  authenticateToken,
  requireRole([RoleEnum.ADMIN, RoleEnum.LEADER]),
  async (req, res) => {
    try {
      const data = await service.getUserProfile(req.user!.accId);
      return res.status(200).json({ success: true, data });
    } catch (err: unknown) {
      if (err instanceof Error && (err as any).statusCode === 404) {
        return res.status(404).json({ success: false, error: err.message });
      }
      return res.status(500).json({ success: false, error: 'Internal Server Error' });
    }
  }
);

router.put(
  '/profile',
  authenticateToken,
  requireRole([RoleEnum.ADMIN, RoleEnum.LEADER]),
  async (req, res) => {
    try {
      if (forbidden(req.body)) {
        return res.status(403).json({
          success: false,
          error: 'You are not allowed to update this field',
        });
      }

      const parsed = updateUserProfileSchema.safeParse(req.body);
      if (!parsed.success) {
        const errors = parsed.error.issues
          .map((i) => `${i.path.join('.') || 'field'}: ${i.message}`)
          .join(', ');

        return res.status(400).json({
          success: false,
          error: 'Validation failed',
          message: errors,
        });
      }

      const data = await service.updateUserProfile(req.user!.accId, parsed.data);
      return res.status(200).json({ success: true, data });
    } catch (err: unknown) {
      if (err instanceof Error && (err as any).statusCode === 404) {
        return res.status(404).json({ success: false, error: err.message });
      }
      if (err instanceof Error && (err as any).statusCode === 409) {
        return res.status(409).json({ success: false, error: err.message });
      }
      return res.status(500).json({ success: false, error: 'Internal Server Error' });
    }
  }
);

export { router as userRouter };
