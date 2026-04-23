import { z } from 'zod';

export const createEventSchema = z.object({
  activity: z.string().regex(/^[a-f\d]{24}$/i, 'Invalid activity'),
  location: z.string().min(1),
  dateFrom: z.string().datetime(),
  dateTo: z.string().datetime().optional(),
  difficulty: z.enum(['beginner', 'medium', 'pro']),
  spots: z.number().int().min(1),
  transport: z.enum(['need-ride', 'has-seats', 'public']),
  budget: z.string().optional(),
  description: z.string().optional(),
});

export const updateEventSchema = createEventSchema.partial();

export const updateEventStatusSchema = z.object({
  status: z.enum(['approved', 'rejected']),
});

export type CreateEventBody = z.infer<typeof createEventSchema>;
export type UpdateEventBody = z.infer<typeof updateEventSchema>;
export type UpdateEventStatusBody = z.infer<typeof updateEventStatusSchema>;
