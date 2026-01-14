import db from '../models/db';

export interface UserRow {
  id: number;
  name: string;
  password: string;
  created_at?: number | null;
  modified_at?: number | null;
}

export interface PublicUser {
  id: number;
  name: string;
}

// Repository no longer owns table creation or seeding; handled by migrations + seeds

export function selectAllPublic(): PublicUser[] {
  const stmt = db.prepare<[], PublicUser>('SELECT id, name FROM users WHERE deleted_at IS NULL ORDER BY id');
  return stmt.all();
}

export function insert(name: string, hashedPassword: string): number {
  const stmt = db.prepare(
    "INSERT INTO users (name, password, created_at, modified_at) VALUES (?, ?, strftime('%s','now'), strftime('%s','now'))"
  );
  const info = stmt.run(name, hashedPassword);
  return Number(info.lastInsertRowid);
}

export function findByName(name: string): UserRow | undefined {
  const stmt = db.prepare<[string], UserRow>(
    'SELECT id, name, password FROM users WHERE name = ? AND deleted_at IS NULL'
  );
  return stmt.get(name);
}

export function archiveById(id: number): boolean {
  const info = db
    .prepare("UPDATE users SET deleted_at = strftime('%s','now'), modified_at = strftime('%s','now') WHERE id = ? AND deleted_at IS NULL")
    .run(id);
  return info.changes > 0;
}

export function restoreById(id: number): boolean {
  const info = db
    .prepare("UPDATE users SET deleted_at = NULL, modified_at = strftime('%s','now') WHERE id = ? AND deleted_at IS NOT NULL")
    .run(id);
  return info.changes > 0;
}
