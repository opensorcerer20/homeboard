import {
  ZodError,
  ZodIssue,
  ZodSchema,
} from 'zod';

export interface ValidationIssue {
  field: string | null;
  message: string;
}

export type ValidationResult<T> =
  | { success: true; data: T }
  | { success: false; errors: ValidationIssue[] };

export function mapZodError(error: ZodError): ValidationIssue[] {
  return error.issues.map((issue: ZodIssue) => ({
    field: issue.path && issue.path.length > 0 ? String(issue.path[0]) : null,
    message: issue.message,
  }));
}

export function validateSchema<T>(schema: ZodSchema<T>, input: unknown): ValidationResult<T> {
  const result = schema.safeParse(input);
  if (result.success) {
    return { success: true, data: result.data };
  }
  return { success: false, errors: mapZodError(result.error) };
}
