import { z } from 'zod';

export const createListItemSchema = z.object({
  name: z
    .string({ required_error: 'name is required' })
    .trim()
    .min(1, 'name is required'),
  category: z.string().nullable().optional(),
});

export type CreateListItemInput = z.infer<typeof createListItemSchema>;
