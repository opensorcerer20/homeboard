import bcrypt from 'bcrypt';

import {
  CreateUserInput,
  createUserSchema,
} from '../models/userModel';
import {
  findByName,
  insert,
  PublicUser,
  selectAllPublic,
} from '../repositories/usersRepository';
import {
  validateSchema,
  ValidationResult,
} from '../validation/zodHelpers';

export function listUsers(): PublicUser[] {
  return selectAllPublic();
}

export function validateCreateUser(input: Partial<CreateUserInput>): string | null;
export function validateCreateUser(
  input: Partial<CreateUserInput>,
  detailed: true,
): ValidationResult<CreateUserInput>;
export function validateCreateUser(
  input: Partial<CreateUserInput>,
  detailed: boolean = false,
): string | null | ValidationResult<CreateUserInput> {
  const result = validateSchema(createUserSchema, input);
  if (detailed) {
    return result;
  }
  if (!result.success) {
    return result.errors[0]?.message ?? 'invalid input';
  }
  return null;
}

export function createUser({ name, password }: CreateUserInput): { id: number; name: string } {
  const normalized = name.trim();

  // Optional: prevent duplicates by name
  const existing = findByName(normalized);
  if (existing) {
    throw new Error('duplicate-name');
  }

  const saltRounds = 10;
  const hashed = bcrypt.hashSync(password, saltRounds);
  const id = insert(normalized, hashed);
  return { id, name: normalized };
}
