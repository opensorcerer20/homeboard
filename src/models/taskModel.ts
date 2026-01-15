import { z } from 'zod';

export const createTaskSchema = z.object({
  name: z
    .string({ required_error: 'name is required' })
    .trim()
    .min(1, 'name is required'),
  category: z.string().nullable().optional(),
  due_date: z
    .number({ invalid_type_error: 'due_date must be a unix timestamp (integer seconds) or null' })
    .int('due_date must be a unix timestamp (integer seconds) or null')
    .nullable()
    .optional(),
  completed: z.boolean({ invalid_type_error: 'completed must be a boolean' }).optional(),
  assigned_user_id: z
    .number({ invalid_type_error: 'assigned_user_id must be an integer or null' })
    .int('assigned_user_id must be an integer or null')
    .nullable()
    .optional(),
});

export const updateTaskSchema = z.object({
  name: z
    .string({ invalid_type_error: 'name must be a non-empty string' })
    .trim()
    .min(1, 'name must be a non-empty string')
    .optional(),
  category: z.string().nullable().optional(),
  due_date: z
    .number({ invalid_type_error: 'due_date must be a unix timestamp (integer seconds) or null' })
    .int('due_date must be a unix timestamp (integer seconds) or null')
    .nullable()
    .optional(),
  completed: z.boolean({ invalid_type_error: 'completed must be a boolean' }).optional(),
  assigned_user_id: z
    .number({ invalid_type_error: 'assigned_user_id must be an integer or null' })
    .int('assigned_user_id must be an integer or null')
    .nullable()
    .optional(),
});

export type CreateTaskInput = z.infer<typeof createTaskSchema>;
export type UpdateTaskInput = z.infer<typeof updateTaskSchema>;
