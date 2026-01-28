import { Router } from 'express';
import { HTTP_STATUS, HEALTH_MESSAGES } from '@uit-volunteer-map/shared';
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
      status: HEALTH_MESSAGES.STATUS_HEALTHY,
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
    },
    message: HEALTH_MESSAGES.SERVER_RUNNING,
  };

  res.status(HTTP_STATUS.OK).json(response);
});

export { router as healthRouter };
