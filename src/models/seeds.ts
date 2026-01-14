import bcrypt from 'bcrypt';

import db from './db';

export function runSeeds() {
  if (process.env.NODE_ENV && process.env.NODE_ENV !== 'development') return;

  const countActive = db.prepare('SELECT COUNT(1) AS c FROM users WHERE deleted_at IS NULL').get() as { c: number };
  if (countActive.c === 0) {
    const saltRounds = 10;
    const insert = db.prepare(
      "INSERT INTO users (name, password, created_at, modified_at) VALUES (?, ?, strftime('%s','now'), strftime('%s','now'))"
    );
    insert.run('Alice', bcrypt.hashSync('password123', saltRounds));
    insert.run('Bob', bcrypt.hashSync('secret', saltRounds));
  }
}
