import { initDb } from '../models/db';
import { runMigrations } from '../models/migrations';

async function main() {
  try {
    initDb();
    runMigrations();
    console.log('Migrations applied successfully.');
  } catch (err) {
    console.error('Migration failed:', err);
    process.exitCode = 1;
  }
}

void main();
