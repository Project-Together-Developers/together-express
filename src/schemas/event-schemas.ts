import { z } from 'zod';

export const createEventSchema = z.object({
  activityId: z.string().regex(/^[a-f\d]{24}$/i, 'Invalid activity'),
  location: z.string().min(1),
  dateFrom: z.string().datetime(),
  dateTo: z.string().datetime().optional(),
  difficulty: z.enum(['beginner', 'medium', 'pro']),
  spots: z.number().int().min(1),
  alreadyGoing: z.number().int().min(0).optional(),
  transport: z.enum(['need-ride', 'has-seats', 'public']),
  budget: z.number().min(0).optional(),
  description: z.string().optional(),
});

export const updateEventSchema = createEventSchema.partial();

export const updateEventStatusSchema = z.object({
  status: z.enum(['approved', 'rejected']),
});

export const getAdminEventsQuerySchema = z.object({
  status: z.enum(['pending', 'approved', 'rejected']).optional(),
});

export type CreateEventBody = z.infer<typeof createEventSchema>;
export type UpdateEventBody = z.infer<typeof updateEventSchema>;
export type UpdateEventStatusBody = z.infer<typeof updateEventStatusSchema>;
export type GetAdminEventsQuery = z.infer<typeof getAdminEventsQuerySchema>;
