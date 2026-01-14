import {
  archiveTask,
  findById,
  insertTask,
  listTasks as repoListTasks,
  PublicTask,
  restoreTask,
  setCompleted,
  updateTask,
} from '../repositories/tasksRepository';
import {
  selectAllPublic as selectAllUsers,
} from '../repositories/usersRepository';

export interface CreateTaskInput {
  name: string;
  category?: string | null;
  due_date?: number | null;
  completed?: boolean;
  assigned_user_id?: number | null;
}

export interface UpdateTaskInput {
  name?: string;
  category?: string | null;
  due_date?: number | null;
  completed?: boolean;
  assigned_user_id?: number | null;
}

export function validateCreateTask(input: Partial<CreateTaskInput>): string | null {
  if (typeof input.name !== 'string' || input.name.trim().length === 0) return 'name is required';
  if (input.category !== undefined && input.category !== null && typeof input.category !== 'string')
    return 'category must be a string or null';
  if (input.due_date !== undefined && input.due_date !== null && !Number.isInteger(input.due_date))
    return 'due_date must be a unix timestamp (integer seconds) or null';
  if (input.completed !== undefined && typeof input.completed !== 'boolean') return 'completed must be a boolean';
  if (input.assigned_user_id !== undefined && input.assigned_user_id !== null && !Number.isInteger(input.assigned_user_id))
    return 'assigned_user_id must be an integer or null';
  return null;
}

export function validateUpdateTask(input: Partial<UpdateTaskInput>): string | null {
  if (input.name !== undefined && (typeof input.name !== 'string' || input.name.trim().length === 0))
    return 'name must be a non-empty string';
  if (input.category !== undefined && input.category !== null && typeof input.category !== 'string')
    return 'category must be a string or null';
  if (input.due_date !== undefined && input.due_date !== null && !Number.isInteger(input.due_date))
    return 'due_date must be a unix timestamp (integer seconds) or null';
  if (input.completed !== undefined && typeof input.completed !== 'boolean') return 'completed must be a boolean';
  if (input.assigned_user_id !== undefined && input.assigned_user_id !== null && !Number.isInteger(input.assigned_user_id))
    return 'assigned_user_id must be an integer or null';
  return null;
}

export function listTasks(options: {
  category?: string | null;
  assigned_user_id?: number | null;
  includeArchived?: boolean;
} = {}): PublicTask[] {
  const { category, assigned_user_id, includeArchived = false } = options;
  return repoListTasks(category, assigned_user_id ?? undefined, includeArchived);
}

export function createTask(input: CreateTaskInput): PublicTask {
  const name = input.name.trim();
  const category = input.category === undefined ? null : input.category;
  const dueDate = input.due_date === undefined ? null : input.due_date;
  const completed = input.completed ?? false;
  const assignedUserId = input.assigned_user_id === undefined ? null : input.assigned_user_id;

  if (assignedUserId !== null) {
    const users = selectAllUsers();
    if (!users.some((u) => u.id === assignedUserId)) throw new Error('invalid-user');
  }

  const id = insertTask(name, category, dueDate, completed, assignedUserId);
  const task = findById(id);
  if (!task) throw new Error('create-failed');
  return task;
}

export function getTask(id: number): PublicTask | undefined {
  return findById(id);
}

export function updateTaskPartial(id: number, input: UpdateTaskInput): boolean {
  return updateTask(id, input);
}

export function setTaskCompleted(id: number, completed: boolean): boolean {
  return setCompleted(id, completed);
}

export function archiveTaskById(id: number): boolean {
  return archiveTask(id);
}

export function restoreTaskById(id: number): boolean {
  return restoreTask(id);
}
