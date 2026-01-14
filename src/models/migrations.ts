import fs from 'fs';
import path from 'path';

import db, { tx } from './db';

type JsonMigration = {
  id: number;
  name: string;
  statements: string[];
};

function ensureMigrationsTable() {
  db.exec(
    `CREATE TABLE IF NOT EXISTS schema_migrations (
      id INTEGER PRIMARY KEY,
      name TEXT NOT NULL,
      applied_at INTEGER NOT NULL
    )`
  );
}

function loadJsonMigrations(): JsonMigration[] {
  const dir = path.join(process.cwd(), 'migrations');
  if (!fs.existsSync(dir)) return [];
  const files = fs
    .readdirSync(dir)
    .filter((f) => f.startsWith('migration_') && f.endsWith('.json'))
    .sort();

  const migrations: JsonMigration[] = [];
  for (const file of files) {
    try {
      const content = fs.readFileSync(path.join(dir, file), 'utf-8');
      const parsed = JSON.parse(content) as JsonMigration;
      if (
        typeof parsed.id === 'number' &&
        typeof parsed.name === 'string' &&
        Array.isArray(parsed.statements)
      ) {
        migrations.push(parsed);
      }
    } catch (_) {
      // skip invalid files
    }
  }
  // sort by id just in case filenames are out of order
  migrations.sort((a, b) => a.id - b.id);
  return migrations;
}

export function runMigrations() {
  ensureMigrationsTable();
  const appliedRows = db.prepare('SELECT id FROM schema_migrations').all() as { id: number }[];
  const applied = new Set(appliedRows.map((r) => r.id));

  const migrations = loadJsonMigrations();
  for (const m of migrations) {
    if (applied.has(m.id)) continue;
    tx(() => {
      for (const sql of m.statements) {
        db.exec(sql);
      }
      db.prepare("INSERT INTO schema_migrations (id, name, applied_at) VALUES (?, ?, strftime('%s','now'))").run(
        m.id,
        m.name
      );
    });
  }
}
