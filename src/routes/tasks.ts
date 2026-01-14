import { Router } from 'express';

import {
  deleteTaskHandler,
  getTaskHandler,
  getTasksHandler,
  patchTaskCompletedHandler,
  patchTaskHandler,
  postRestoreTaskHandler,
  postTaskHandler,
} from '../controllers/tasksController';

const router = Router();

// GET /api/tasks
router.get('/', getTasksHandler);

// GET /api/tasks/:id
router.get('/:id', getTaskHandler);

// POST /api/tasks
router.post('/', postTaskHandler);

// PATCH /api/tasks/:id
router.patch('/:id', patchTaskHandler);

// PATCH /api/tasks/:id/completed
router.patch('/:id/completed', patchTaskCompletedHandler);

// DELETE /api/tasks/:id (soft delete)
router.delete('/:id', deleteTaskHandler);

// POST /api/tasks/:id/restore (undo soft delete)
router.post('/:id/restore', postRestoreTaskHandler);

export default router;
