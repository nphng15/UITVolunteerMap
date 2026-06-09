import { Router } from 'express';
import { CampaignPhotoService } from '../service/campaignPhotoService.js';
import { validate } from '../middleware/validate.js';
import { campaignPhotoSchema } from '../schemas/checkin.js';
import { authenticateToken, requireRole } from '../middleware/auth.js';
import { HttpError } from '../errors/HttpError.js';
import {
  RoleEnum,
  HTTP_STATUS,
  ERROR_MESSAGES,
  CAMPAIGN_PHOTO_MESSAGES,
} from '@uit-volunteer-map/shared';

// mergeParams để đọc :campaignId từ router cha (mount dưới /api/campaigns/:campaignId/photos).
const router = Router({ mergeParams: true });
const service = new CampaignPhotoService();

router.get('/', authenticateToken, async (req, res) => {
  try {
    const campaignId = Number(req.params.campaignId);
    if (isNaN(campaignId)) {
      return res.status(HTTP_STATUS.BAD_REQUEST).json({ success: false, error: 'Invalid campaign ID' });
    }
    const data = await service.getCampaignWall(campaignId);
    res.status(HTTP_STATUS.OK).json({ success: true, data });
  } catch (err: unknown) {
    if (err instanceof HttpError) {
      return res.status(err.statusCode).json({ success: false, error: err.message });
    }
    res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({ success: false, error: ERROR_MESSAGES.INTERNAL_SERVER_ERROR });
  }
});

router.post(
  '/',
  authenticateToken,
  requireRole([RoleEnum.VOLUNTEER, RoleEnum.LEADER, RoleEnum.ADMIN]),
  validate(campaignPhotoSchema),
  async (req, res) => {
    try {
      const campaignId = Number(req.params.campaignId);
      if (isNaN(campaignId)) {
        return res.status(HTTP_STATUS.BAD_REQUEST).json({ success: false, error: 'Invalid campaign ID' });
      }
      const data = await service.addMoment(campaignId, req.user!.accId, req.body);
      res.status(HTTP_STATUS.CREATED).json({ success: true, data, message: CAMPAIGN_PHOTO_MESSAGES.CREATED });
    } catch (err: unknown) {
      if (err instanceof HttpError) {
        return res.status(err.statusCode).json({ success: false, error: err.message });
      }
      res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({ success: false, error: ERROR_MESSAGES.INTERNAL_SERVER_ERROR });
    }
  }
);

router.delete('/:photoId', authenticateToken, async (req, res) => {
  try {
    const campaignId = Number(req.params.campaignId);
    const photoId = Number(req.params.photoId);
    if (isNaN(campaignId) || isNaN(photoId)) {
      return res.status(HTTP_STATUS.BAD_REQUEST).json({ success: false, error: 'Invalid ID' });
    }
    await service.deletePhoto(campaignId, photoId, req.user!.accId, req.user!.role);
    res.status(HTTP_STATUS.OK).json({ success: true, data: null, message: CAMPAIGN_PHOTO_MESSAGES.DELETED });
  } catch (err: unknown) {
    if (err instanceof HttpError) {
      return res.status(err.statusCode).json({ success: false, error: err.message });
    }
    res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({ success: false, error: ERROR_MESSAGES.INTERNAL_SERVER_ERROR });
  }
});

export { router as campaignPhotoRouter };
