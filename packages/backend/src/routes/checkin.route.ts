import { Router } from 'express';
import { CheckInService } from '../service/checkinService.js';
import { validate } from '../middleware/validate.js';
import { checkInSchema } from '../schemas/checkin.js';
import { authenticateToken, requireRole } from '../middleware/auth.js';
import { HttpError } from '../errors/HttpError.js';
import {
  RoleEnum,
  HTTP_STATUS,
  ERROR_MESSAGES,
  CHECKIN_MESSAGES,
} from '@uit-volunteer-map/shared';

const router = Router();
const checkInService = new CheckInService();

router.post(
  '/',
  authenticateToken,
  requireRole([RoleEnum.VOLUNTEER, RoleEnum.LEADER, RoleEnum.ADMIN]),
  validate(checkInSchema),
  async (req, res) => {
    try {
      const data = await checkInService.checkIn(req.body, req.user!.accId);
      res.status(HTTP_STATUS.CREATED).json({
        success: true,
        data,
        message: CHECKIN_MESSAGES.SUCCESS,
      });
    } catch (err: unknown) {
      if (err instanceof HttpError) {
        return res.status(err.statusCode).json({ success: false, error: err.message });
      }
      res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({
        success: false,
        error: ERROR_MESSAGES.INTERNAL_SERVER_ERROR,
      });
    }
  }
);

router.get(
  '/history',
  authenticateToken,
  async (req, res) => {
    try {
      const data = await checkInService.getHistory(req.user!.accId);
      res.status(HTTP_STATUS.OK).json({ success: true, data });
    } catch (err: unknown) {
      if (err instanceof HttpError) {
        return res.status(err.statusCode).json({ success: false, error: err.message });
      }
      res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({
        success: false,
        error: ERROR_MESSAGES.INTERNAL_SERVER_ERROR,
      });
    }
  }
);

export { router as checkInRouter };
