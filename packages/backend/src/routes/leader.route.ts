import { Router } from 'express';
import { authenticateToken, requireRole } from '../middleware/auth.js';
import { RoleEnum } from '../enums/RoleEnum.js';

const router = Router();

router.get(
  '/leader-only',
  authenticateToken,
  requireRole([RoleEnum.LEADER]),
  async (_req, res) => {
    res.json({ message: "Message by leader" });
  }
);

export { router as leaderRouter };