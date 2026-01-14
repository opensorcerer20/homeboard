import bcrypt from 'bcrypt';

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

export function initUsersRepository() {
  // Create users table if it doesn't exist (includes deleted_at for soft delete)
  db.exec(
    `CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      password TEXT NOT NULL,
      created_at INTEGER,
      modified_at INTEGER,
      deleted_at INTEGER
    )`
  );

  // Upgrade path: ensure timestamp/soft-delete columns exist and backfill
  const cols = db.prepare(`PRAGMA table_info('users')`).all() as { name: string }[];
  if (!cols.some((c) => c.name === 'created_at')) {
    db.exec(`ALTER TABLE users ADD COLUMN created_at INTEGER`);
    db.exec(`UPDATE users SET created_at = strftime('%s','now') WHERE created_at IS NULL`);
  }
  if (!cols.some((c) => c.name === 'modified_at')) {
    db.exec(`ALTER TABLE users ADD COLUMN modified_at INTEGER`);
    db.exec(`UPDATE users SET modified_at = strftime('%s','now') WHERE modified_at IS NULL`);
  }
  if (!cols.some((c) => c.name === 'deleted_at')) {
    db.exec(`ALTER TABLE users ADD COLUMN deleted_at INTEGER`);
  }

  // Seed demo users if no active users
  const countStmt = db.prepare('SELECT COUNT(*) as count FROM users WHERE deleted_at IS NULL');
  const { count } = countStmt.get() as { count: number };
  if (count === 0) {
    const saltRounds = 10;
    const aliceHash = bcrypt.hashSync('password123', saltRounds);
    const bobHash = bcrypt.hashSync('secret', saltRounds);
    const insert = db.prepare(
      'INSERT INTO users (name, password, created_at, modified_at) VALUES (?, ?, strftime("%s","now"), strftime("%s","now"))'
    );
    insert.run('Alice', aliceHash);
    insert.run('Bob', bobHash);
  }
}

export function selectAllPublic(): PublicUser[] {
  const stmt = db.prepare<[], PublicUser>('SELECT id, name FROM users WHERE deleted_at IS NULL ORDER BY id');
  return stmt.all();
}

export function insert(name: string, hashedPassword: string): number {
  const stmt = db.prepare(
    'INSERT INTO users (name, password, created_at, modified_at) VALUES (?, ?, strftime("%s","now"), strftime("%s","now"))'
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
    .prepare('UPDATE users SET deleted_at = strftime("%s","now"), modified_at = strftime("%s","now") WHERE id = ? AND deleted_at IS NULL')
    .run(id);
  return info.changes > 0;
}

export function restoreById(id: number): boolean {
  const info = db
    .prepare('UPDATE users SET deleted_at = NULL, modified_at = strftime("%s","now") WHERE id = ? AND deleted_at IS NOT NULL')
    .run(id);
  return info.changes > 0;
}
