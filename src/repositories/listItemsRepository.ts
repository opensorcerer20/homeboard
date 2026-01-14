import db from '../models/db';

export interface ListItemRow {
  id: number;
  name: string;
  category: string | null;
  sorting: number;
  created_at: number | null;
}

export interface PublicListItem {
  id: number;
  name: string;
  category: string | null;
  sorting: number;
}

// Repository no longer owns table creation; handled by migrations

export function insertListItem(name: string, category: string | null, sorting: number): number {
  const stmt = db.prepare(
    `INSERT INTO list_items (name, category, sorting, created_at)
     VALUES (?, ?, ?, strftime('%s','now'))`
  );
  const info = stmt.run(name, category ?? null, sorting);
  return Number(info.lastInsertRowid);
}

export function listItemsByCategory(category: string): PublicListItem[] {
  const stmt = db.prepare<[string], PublicListItem>(
    `SELECT id, name, category, sorting
     FROM list_items
     WHERE category = ?
     ORDER BY sorting ASC, id ASC`
  );
  return stmt.all(category);
}

export function listAllItems(): PublicListItem[] {
  const stmt = db.prepare<[], PublicListItem>(
    `SELECT id, name, category, sorting
     FROM list_items
     ORDER BY category ASC, sorting ASC, id ASC`
  );
  return stmt.all();
}

export function updateSorting(id: number, sorting: number): boolean {
  const stmt = db.prepare('UPDATE list_items SET sorting = ?, created_at = created_at WHERE id = ?');
  const info = stmt.run(sorting, id);
  return info.changes > 0;
}
