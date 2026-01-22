import { Router } from 'express';
import { authenticateToken, requireRole } from '../middleware/auth.js';

const router = Router();

router.get(
  '/admin-only',
  authenticateToken,
  requireRole(['admin']),
  async (_req, res) => {
    res.json({ message: "Message by admin" });
  }
);

export { router as adminRouter };