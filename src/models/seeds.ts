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

  try {
    const tableExists = db
      .prepare("SELECT name FROM sqlite_master WHERE type='table' AND name='tasks'")
      .get() as { name?: string } | undefined;
    if (tableExists && tableExists.name === 'tasks') {
      const countTasks = db.prepare('SELECT COUNT(1) AS c FROM tasks WHERE deleted_at IS NULL').get() as { c: number };
      if (countTasks.c === 0) {
        const insertTask = db.prepare(
          "INSERT INTO tasks (name, category, due_date, completed, assigned_user_id, created_at, modified_at) VALUES (?, ?, ?, ?, ?, strftime('%s','now'), strftime('%s','now'))"
        );
        insertTask.run('Buy groceries', 'shopping', null, 0, null);
        insertTask.run('Vacuum living room', 'chores', null, 0, null);
        insertTask.run('Pay electricity bill', 'reminders', null, 0, null);
      }
    }
  } catch (_) {
    // ignore if tasks table does not exist or any seed error
  }
}
