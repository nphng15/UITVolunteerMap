import { z } from "zod";

export const createTeamSchema = z.object({
  teamName: z
    .string()
    .min(3, "Team name must be at least 3 characters")
    .max(100, "Team name must not exceed 100 characters"),
  leaderId: z.number().int().positive("Leader ID is required"),
  campaignId: z.number().int().positive("Campaign ID is required"),
  description: z.string().optional().nullable(),
  imageUrl: z.string().url("Invalid image URL").optional().nullable(),
});

export type CreateTeamInput = z.infer<typeof createTeamSchema>;

export const updateTeamSchema = z.object({
  teamName: z.string().min(1, "Team name cannot be empty").optional(),
  description: z.string().optional().nullable(),
  imageUrl: z.string().url("Invalid image URL").optional().nullable(),
});

export type UpdateTeamInput = z.infer<typeof updateTeamSchema>;

