import bcrypt from 'bcrypt';

import {
  findByName,
  insert,
  PublicUser,
  selectAllPublic,
} from '../repositories/usersRepository';

export function listUsers(): PublicUser[] {
  return selectAllPublic();
}

export interface CreateUserInput {
  name: string;
  password: string;
}

export function validateCreateUser({ name, password }: Partial<CreateUserInput>): string | null {
  if (typeof name !== 'string' || name.trim().length === 0) return 'name is required';
  if (typeof password !== 'string' || password.length < 6) return 'password must be at least 6 chars';
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
