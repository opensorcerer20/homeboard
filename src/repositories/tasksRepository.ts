import { CATEGORY } from '../models/categories';
import db from '../models/db';

export interface TaskRow {
  id: number;
  name: string;
  category: string | null;
  due_date: number | null;
  completed: number; // 0 or 1
  assigned_user_id: number | null;
  created_at: number;
  modified_at: number;
  deleted_at: number | null;
}

export interface PublicTask {
  id: number;
  name: string;
  category: string | null;
  due_date: number | null;
  completed: boolean;
  assigned_user_id: number | null;
}

export function insertTask(
  name: string,
  category: string | null,
  dueDate: number | null,
  completed: boolean,
  assignedUserId: number | null
): number {
  const stmt = db.prepare(
    "INSERT INTO tasks (name, category, due_date, completed, assigned_user_id, created_at, modified_at) VALUES (?, ?, ?, ?, ?, strftime('%s','now'), strftime('%s','now'))"
  );
  const info = stmt.run(name, category, dueDate, completed ? 1 : 0, assignedUserId);
  return Number(info.lastInsertRowid);
}

export function addReminder(
  name: string,
  dueDate: number | null = null,
  assignedUserId: number | null = null
): number {
	return insertTask(name, CATEGORY.REMINDER, dueDate, false, assignedUserId);
}

export function addChore(
  name: string,
  dueDate: number | null = null,
  assignedUserId: number | null = null
): number {
	return insertTask(name, CATEGORY.CHORE, dueDate, false, assignedUserId);
}

export function toPublic(row: TaskRow): PublicTask {
  return {
    id: row.id,
    name: row.name,
    category: row.category,
    due_date: row.due_date,
    completed: !!row.completed,
    assigned_user_id: row.assigned_user_id,
  };
}

export function findById(id: number): PublicTask | undefined {
  const row = db
    .prepare<[number], TaskRow>(
      `SELECT id, name, category, due_date, completed, assigned_user_id, created_at, modified_at, deleted_at
       FROM tasks WHERE id = ? AND deleted_at IS NULL`
    )
    .get(id);
  return row ? toPublic(row) : undefined;
}

export function listTasks(
  category?: string | null,
  assignedUserId?: number | null,
  includeArchived: boolean = false
): PublicTask[] {
  const where: string[] = [];
  const params: any[] = [];
  if (!includeArchived) {
    where.push('deleted_at IS NULL');
  }
  if (typeof category === 'string') {
    where.push('category = ?');
    params.push(category);
  } else if (category === null) {
    where.push('category IS NULL');
  }
  if (typeof assignedUserId === 'number') {
    where.push('assigned_user_id = ?');
    params.push(assignedUserId);
  } else if (assignedUserId === null) {
    where.push('assigned_user_id IS NULL');
  }
  const whereSql = where.length ? `WHERE ${where.join(' AND ')}` : '';
  const rows = db
    .prepare<any[], TaskRow>(
      `SELECT id, name, category, due_date, completed, assigned_user_id, created_at, modified_at, deleted_at
       FROM tasks ${whereSql}
       ORDER BY completed ASC, due_date IS NULL ASC, due_date ASC, id ASC`
    )
    .all(...params);
  return rows.map(toPublic);
}

export function updateTask(
  id: number,
  fields: Partial<{
    name: string;
    category: string | null;
    due_date: number | null;
    completed: boolean;
    assigned_user_id: number | null;
  }>
): boolean {
  const sets: string[] = [];
  const params: any[] = [];
  if (fields.name !== undefined) {
    sets.push('name = ?');
    params.push(fields.name);
  }
  if (fields.category !== undefined) {
    if (fields.category === null) {
      sets.push('category = NULL');
    } else {
      sets.push('category = ?');
      params.push(fields.category);
    }
  }
  if (fields.due_date !== undefined) {
    if (fields.due_date === null) {
      sets.push('due_date = NULL');
    } else {
      sets.push('due_date = ?');
      params.push(fields.due_date);
    }
  }
  if (fields.completed !== undefined) {
    sets.push('completed = ?');
    params.push(fields.completed ? 1 : 0);
  }
  if (fields.assigned_user_id !== undefined) {
    if (fields.assigned_user_id === null) {
      sets.push('assigned_user_id = NULL');
    } else {
      sets.push('assigned_user_id = ?');
      params.push(fields.assigned_user_id);
    }
  }
  if (sets.length === 0) return false;
  sets.push("modified_at = strftime('%s','now')");
  params.push(id);
  const info = db.prepare(`UPDATE tasks SET ${sets.join(', ')} WHERE id = ? AND deleted_at IS NULL`).run(...params);
  return info.changes > 0;
}

export function setCompleted(id: number, completed: boolean): boolean {
  const info = db
    .prepare("UPDATE tasks SET completed = ?, modified_at = strftime('%s','now') WHERE id = ? AND deleted_at IS NULL")
    .run(completed ? 1 : 0, id);
  return info.changes > 0;
}

export function archiveTask(id: number): boolean {
  const info = db
    .prepare("UPDATE tasks SET deleted_at = strftime('%s','now'), modified_at = strftime('%s','now') WHERE id = ? AND deleted_at IS NULL")
    .run(id);
  return info.changes > 0;
}

export function restoreTask(id: number): boolean {
  const info = db
    .prepare("UPDATE tasks SET deleted_at = NULL, modified_at = strftime('%s','now') WHERE id = ? AND deleted_at IS NOT NULL")
    .run(id);
  return info.changes > 0;
}
