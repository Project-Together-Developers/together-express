import { z } from 'zod';

export const createActivitySchema = z.object({
  name: z.string().min(1),
  icon: z.string().min(1),
  isActive: z.boolean().optional(),
});

export const updateActivitySchema = createActivitySchema.partial();

export type CreateActivityBody = z.infer<typeof createActivitySchema>;
export type UpdateActivityBody = z.infer<typeof updateActivitySchema>;
