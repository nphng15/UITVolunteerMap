import { z } from 'zod';

export const updateTeamSchema = z.object({
  // .min(1) ensures the name cannot be empty string (Requirement: Cannot delete team name)
  teamName: z.string().min(1, "Team name is required").optional(),
  
  // 'description' is optional and can be null
  description: z.string().optional().nullable(),
});

// Export the type for type inference in Service
export type UpdateTeamInput = z.infer<typeof updateTeamSchema>;