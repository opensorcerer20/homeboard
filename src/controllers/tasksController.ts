import {
  Request,
  Response,
} from 'express';

import {
  archiveTaskById,
  createTask,
  getTask,
  listTasks,
  restoreTaskById,
  setTaskCompleted,
  updateTaskPartial,
  validateCreateTask,
  validateUpdateTask,
} from '../services/tasksService';

export function getTasksHandler(req: Request, res: Response) {
  const category = req.query.category === undefined ? undefined : (req.query.category === 'null' ? null : String(req.query.category));
  const assigned = req.query.assignedUserId === undefined ? undefined : (req.query.assignedUserId === 'null' ? null : Number(req.query.assignedUserId));
  if (assigned !== undefined && assigned !== null && !Number.isInteger(assigned)) return res.status(400).json({ error: 'assignedUserId must be integer or null' });
  const includeArchived = req.query.includeArchived === 'true';
  const tasks = listTasks({ category: category as any, assigned_user_id: assigned as any, includeArchived });
  res.json({ items: tasks });
}

export function getTaskHandler(req: Request, res: Response) {
  const id = Number(req.params.id);
  if (!Number.isInteger(id) || id <= 0) return res.status(400).json({ error: 'invalid id' });
  const task = getTask(id);
  if (!task) return res.status(404).json({ error: 'not found' });
  res.json(task);
}

export function postTaskHandler(req: Request, res: Response) {
  const error = validateCreateTask(req.body);
  if (error) return res.status(400).json({ error });
  try {
    const result = createTask({
      name: req.body.name,
      category: req.body.category ?? null,
      due_date: req.body.due_date ?? null,
      completed: !!req.body.completed,
      assigned_user_id: req.body.assigned_user_id ?? null,
    });
    return res.status(201).json(result);
  } catch (err: any) {
    if (err?.message === 'invalid-user') return res.status(400).json({ error: 'assigned_user_id not found' });
    return res.status(500).json({ error: 'failed to create task' });
  }
}

export function patchTaskHandler(req: Request, res: Response) {
  const id = Number(req.params.id);
  if (!Number.isInteger(id) || id <= 0) return res.status(400).json({ error: 'invalid id' });
  const error = validateUpdateTask(req.body);
  if (error) return res.status(400).json({ error });
  try {
    const ok = updateTaskPartial(id, req.body);
    if (!ok) return res.status(404).json({ error: 'not found or no changes' });
    const task = getTask(id);
    if (!task) return res.status(404).json({ error: 'not found' });
    return res.json(task);
  } catch (err: any) {
    if (String(err?.message).includes('FOREIGN KEY')) return res.status(400).json({ error: 'assigned_user_id not found' });
    return res.status(500).json({ error: 'failed to update task' });
  }
}

export function patchTaskCompletedHandler(req: Request, res: Response) {
  const id = Number(req.params.id);
  const completed = !!req.body?.completed;
  if (!Number.isInteger(id) || id <= 0) return res.status(400).json({ error: 'invalid id' });
  try {
    const ok = setTaskCompleted(id, completed);
    if (!ok) return res.status(404).json({ error: 'not found' });
    const task = getTask(id);
    if (!task) return res.status(404).json({ error: 'not found' });
    return res.json(task);
  } catch {
    return res.status(500).json({ error: 'failed to update completion' });
  }
}

export function deleteTaskHandler(req: Request, res: Response) {
  const id = Number(req.params.id);
  if (!Number.isInteger(id) || id <= 0) return res.status(400).json({ error: 'invalid id' });
  try {
    const ok = archiveTaskById(id);
    if (!ok) return res.status(404).json({ error: 'not found' });
    return res.status(204).send();
  } catch {
    return res.status(500).json({ error: 'failed to delete task' });
  }
}

export function postRestoreTaskHandler(req: Request, res: Response) {
  const id = Number(req.params.id);
  if (!Number.isInteger(id) || id <= 0) return res.status(400).json({ error: 'invalid id' });
  try {
    const ok = restoreTaskById(id);
    if (!ok) return res.status(404).json({ error: 'not found' });
    const task = getTask(id);
    if (!task) return res.status(404).json({ error: 'not found' });
    return res.json(task);
  } catch {
    return res.status(500).json({ error: 'failed to restore task' });
  }
}
