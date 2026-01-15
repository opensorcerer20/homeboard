import bcrypt from 'bcrypt';

import { CATEGORY } from './categories';
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

  // Seed list_items only if the table exists and has no rows yet
  try {
  const listItemsTable = db
    .prepare("SELECT name FROM sqlite_master WHERE type='table' AND name='list_items'")
    .get() as { name?: string } | undefined;
  if (listItemsTable && listItemsTable.name === 'list_items') {
    const countListItems = db
      .prepare('SELECT COUNT(1) AS c FROM list_items')
      .get() as { c: number };
    if (countListItems.c === 0) {
      const insertListItem = db.prepare(
        'INSERT INTO list_items (name, category) VALUES (?, ?)' 
      );
      // Groceries
      insertListItem.run('Milk', CATEGORY.GROCERIES);
      insertListItem.run('Eggs', CATEGORY.GROCERIES);
      insertListItem.run('Bread', CATEGORY.GROCERIES);
      // Shopping
      insertListItem.run('Paper towels', CATEGORY.SHOPPING);
      insertListItem.run('Dish soap', CATEGORY.SHOPPING);
    }
  }
  } catch (_) {
  // ignore if list_items table does not exist or any seed error
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
        insertTask.run('Buy groceries', CATEGORY.SHOPPING, null, 0, null);
        insertTask.run('Vacuum living room', CATEGORY.CHORE, null, 0, null);
        insertTask.run('Pay electricity bill', CATEGORY.REMINDER, null, 0, null);

        // Also seed tasks that use the canonical 'chore' and 'reminder' categories
        insertTask.run('Take out trash', CATEGORY.CHORE, null, 0, null);
        insertTask.run('Do the dishes', CATEGORY.CHORE, null, 0, null);
        insertTask.run('Call mom', CATEGORY.REMINDER, null, 0, null);
        insertTask.run('Renew car registration', CATEGORY.REMINDER, null, 0, null);
      }
    }
  } catch (_) {
    // ignore if tasks table does not exist or any seed error
  }
}
