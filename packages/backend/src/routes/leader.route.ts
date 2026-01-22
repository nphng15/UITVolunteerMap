import { Router } from 'express';
import { authenticateToken, requireRole } from '../middleware/auth.js';

const router = Router();

router.get(
  '/leader-only',
  authenticateToken,
  requireRole(['leader']),
  async (_req, res) => {
    res.json({ message: "Message by leader" });
  }
);

export { router as leaderRouter };