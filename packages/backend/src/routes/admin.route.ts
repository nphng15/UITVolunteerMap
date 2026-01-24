import { Router } from 'express';
import { authenticateToken, requireRole } from '../middleware/auth.js';
import { RoleEnum } from '../enums/RoleEnum.js';

const router = Router();

router.get(
  '/admin-only',
  authenticateToken,
  requireRole([RoleEnum.ADMIN]),
  async (_req, res) => {
    res.json({ message: "Message by admin" });
  }
);

export { router as adminRouter };