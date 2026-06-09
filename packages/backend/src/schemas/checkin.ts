import { z } from 'zod';

export const checkInSchema = z.object({
  campaignId: z.number().int().positive("Campaign ID phải là số dương"),
  latitude: z.number().min(-90, "Latitude phải từ -90 đến 90").max(90, "Latitude phải từ -90 đến 90"),
  longitude: z.number().min(-180, "Longitude phải từ -180 đến 180").max(180, "Longitude phải từ -180 đến 180"),
  imageUrl: z.string().url("imageUrl phải là URL hợp lệ").optional(),
});

export type CheckInInput = z.infer<typeof checkInSchema>;

export const campaignPhotoSchema = z.object({
  imageUrl: z.string().url("imageUrl phải là URL hợp lệ"),
  caption: z.string().max(500, "Caption tối đa 500 ký tự").optional(),
});

export type CampaignPhotoInput = z.infer<typeof campaignPhotoSchema>;
