import { Router } from 'express';
import { CampaignService } from '../service/campaign.service.js';
import { validate } from '../middleware/validate.js';
import { createCampaignSchema, updateCampaignSchema } from '../schemas/campaign.js';
import { authenticateToken, requireRole } from '../middleware/auth.js';
import { RoleEnum } from '@uit-volunteer-map/shared';

const router = Router();
const campaignService = new CampaignService();

router.use(authenticateToken, requireRole([RoleEnum.ADMIN, RoleEnum.LEADER]));

router.get('/', async (_req, res) => {
  try {
    const data = await campaignService.getAll();
    res.json({ success: true, data });
  } catch {
    res.status(500).json({ success: false, error: 'Internal Server Error' });
  }
});

router.get('/:id', async (req, res) => {
  try {
    const id = Number(req.params.id);
    if (isNaN(id)) {
      return res.status(400).json({ success: false, error: 'Invalid campaign ID' });
    }
    const data = await campaignService.getOne(id);
    res.json({ success: true, data });
  } catch {
    res.status(404).json({ success: false, error: 'Campaign not found' });
  }
});

router.post('/', validate(createCampaignSchema), async (req, res) => {
  try {
    const data = await campaignService.create(req.body);
    res.status(201).json({ success: true, data });
  } catch (err: unknown) {
    if (err instanceof Error && err.message === 'CAMPAIGN_EXISTS') {
      return res.status(409).json({ success: false, error: 'Campaign name already exists' });
    }
    res.status(500).json({ success: false, error: 'Internal Server Error' });
  }
});

router.put('/:id', validate(updateCampaignSchema), async (req, res) => {
  try {
    const id = Number(req.params.id);
    if (isNaN(id)) {
      return res.status(400).json({ success: false, error: 'Invalid campaign ID' });
    }
    const data = await campaignService.update(id, req.body);
    res.json({ success: true, data });
  } catch {
    res.status(404).json({ success: false, error: 'Campaign not found' });
  }
});

router.delete('/:id', async (req, res) => {
  try {
    const id = Number(req.params.id);
    if (isNaN(id)) {
      return res.status(400).json({ success: false, error: 'Invalid campaign ID' });
    }
    await campaignService.delete(id);
    res.json({ success: true, message: 'Campaign deleted successfully' });
  } catch {
    res.status(404).json({ success: false, error: 'Campaign not found' });
  }
});

export { router as campaignRouter };
