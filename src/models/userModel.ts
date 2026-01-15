import { z } from 'zod';

export const createUserSchema = z.object({
  name: z
    .string({ required_error: 'name is required' })
    .trim()
    .min(1, 'name is required'),
  password: z
    .string({ required_error: 'password must be at least 6 chars' })
    .min(6, 'password must be at least 6 chars'),
});

export type CreateUserInput = z.infer<typeof createUserSchema>;
