import { initDb } from '../models/db';
import { runSeeds } from '../models/seeds';

async function main() {
  try {
    initDb();
    runSeeds();
    console.log('Seeding complete.');
  } catch (err) {
    console.error('Seeding failed:', err);
    process.exitCode = 1;
  }
}

void main();
