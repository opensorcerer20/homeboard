import fs from 'fs';
import path from 'path';

async function main() {
  if (process.env.NODE_ENV !== 'development') {
    console.error(
      'db:reset is allowed only in development. Set NODE_ENV=development to proceed.'
    );
    process.exit(1);
  }

  const dbPath = path.join(process.cwd(), 'data', 'homeboard.db');

  try {
    // Ensure data directory exists
    fs.mkdirSync(path.dirname(dbPath), { recursive: true });

    // Remove existing database file if present
    if (fs.existsSync(dbPath)) {
      fs.unlinkSync(dbPath);
      console.log(`Removed database file at ${dbPath}`);
    }

    // Dynamically import after deletion so a fresh DB is created
    const { initDb } = await import('../models/db');
    const { runMigrations } = await import('../models/migrations');
    const { runSeeds } = await import('../models/seeds');

    initDb();
    runMigrations();
    runSeeds();

    console.log('Database reset complete (migrated + seeded).');
    process.exit(0);
  } catch (err) {
    console.error('Database reset failed:', err);
    process.exit(1);
  }
}

main();
