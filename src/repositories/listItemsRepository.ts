import { CATEGORY } from '../models/categories';
import db from '../models/db';

export interface ListItemRow {
  id: number;
  name: string;
  category: string | null;
  created_at: number | null;
}

export interface PublicListItem {
  id: number;
  name: string;
  category: string | null;
}

// Repository no longer owns table creation; handled by migrations

export function insertListItem(name: string, category: string | null): number {
  const stmt = db.prepare(
    `INSERT INTO list_items (name, category, created_at)
     VALUES (?, ?, strftime('%s','now'))`
  );
  const info = stmt.run(name, category ?? null);
  return Number(info.lastInsertRowid);
}

export function addShopping(name: string): number {
  return insertListItem(name, CATEGORY.SHOPPING);
}

export function addGroceries(name: string): number {
  return insertListItem(name, CATEGORY.GROCERIES);
}

export function listItemsByCategory(category: string): PublicListItem[] {
  const stmt = db.prepare<[string], PublicListItem>(
    `SELECT id, name, category
     FROM list_items
     WHERE category = ?
     ORDER BY id ASC`
  );
  return stmt.all(category);
}

export function listAllItems(): PublicListItem[] {
  const stmt = db.prepare<[], PublicListItem>(
    `SELECT id, name, category
     FROM list_items
     ORDER BY category ASC, id ASC`
  );
  return stmt.all();
}
