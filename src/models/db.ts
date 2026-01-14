import Database from 'better-sqlite3';
import fs from 'fs';
import path from 'path';

const DB_FILE = path.join(process.cwd(), 'data', 'homeboard.db');

// Ensure data directory exists
fs.mkdirSync(path.dirname(DB_FILE), { recursive: true });

const db = new Database(DB_FILE);

export function initDb() {
  // Improve durability/concurrency for small apps
  try {
    db.pragma('journal_mode = WAL');
  } catch (_) {
    // ignore pragma errors
  }
}

export default db;
