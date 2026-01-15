import {
  CreateTaskInput,
  createTaskSchema,
  UpdateTaskInput,
  updateTaskSchema,
} from '../models/taskModel';
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
import {
  validateSchema,
  ValidationResult,
} from '../validation/zodHelpers';

export function validateCreateTask(input: Partial<CreateTaskInput>): string | null;
export function validateCreateTask(
  input: Partial<CreateTaskInput>,
  detailed: true,
): ValidationResult<CreateTaskInput>;
export function validateCreateTask(
  input: Partial<CreateTaskInput>,
  detailed: boolean = false,
): string | null | ValidationResult<CreateTaskInput> {
  const result = validateSchema(createTaskSchema, input);
  if (detailed) {
    return result;
  }
  if (!result.success) {
    return result.errors[0]?.message ?? 'invalid input';
  }
  return null;
}

export function validateUpdateTask(input: Partial<UpdateTaskInput>): string | null;
export function validateUpdateTask(
  input: Partial<UpdateTaskInput>,
  detailed: true,
): ValidationResult<UpdateTaskInput>;
export function validateUpdateTask(
  input: Partial<UpdateTaskInput>,
  detailed: boolean = false,
): string | null | ValidationResult<UpdateTaskInput> {
  const result = validateSchema(updateTaskSchema, input);
  if (detailed) {
    return result;
  }
  if (!result.success) {
    return result.errors[0]?.message ?? 'invalid input';
  }
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
