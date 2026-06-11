import { Router } from 'express';
import { UploadService } from '../service/uploadService.js';
import { uploadImage } from '../middleware/upload.js';
import { authenticateToken } from '../middleware/auth.js';
import { HTTP_STATUS, ERROR_MESSAGES } from '@uit-volunteer-map/shared';

const router = Router();
const uploadService = new UploadService();

router.post('/image', authenticateToken, uploadImage.single('image'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(HTTP_STATUS.BAD_REQUEST).json({
        success: false,
        error: 'No image file provided',
      });
    }

    const url = await uploadService.uploadBuffer(req.file.buffer);
    res.status(HTTP_STATUS.CREATED).json({ success: true, data: { url } });
  } catch (err: unknown) {
    console.error('[upload.route] uploadBuffer failed:', err);
    const message = err instanceof Error ? err.message : ERROR_MESSAGES.INTERNAL_SERVER_ERROR;
    res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({ success: false, error: message });
  }
});

export { router as uploadRouter };
