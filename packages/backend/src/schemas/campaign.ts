import { z } from 'zod';

export const createCampaignSchema = z.object({
  campaignName: z.string().min(1, "Tên chiến dịch bắt buộc"),
  description: z.string().optional().nullable(),
  startDate: z.string().min(1, "Ngày bắt đầu bắt buộc"),
  endDate: z.string().min(1, "Ngày kết thúc bắt buộc"),
  latitude: z.number().min(-90).max(90).optional().nullable(),
  longitude: z.number().min(-180).max(180).optional().nullable(),
  checkInRadius: z.number().positive().optional().nullable(),
});

export const updateCampaignSchema = createCampaignSchema.partial();

export type CreateCampaignInput = z.infer<typeof createCampaignSchema>;
export type UpdateCampaignInput = z.infer<typeof updateCampaignSchema>;
