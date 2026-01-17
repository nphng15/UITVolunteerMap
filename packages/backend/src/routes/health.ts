import { Router } from 'express';
import type { ApiResponse } from '@uit-volunteer-map/shared';

const router = Router();

interface HealthData {
  status: string;
  timestamp: string;
  uptime: number;
}

router.get('/', (_req, res) => {
  const response: ApiResponse<HealthData> = {
    success: true,
    data: {
      status: 'healthy',
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
    },
    message: 'Server is running',
  };

  res.json(response);
});

export { router as healthRouter };
