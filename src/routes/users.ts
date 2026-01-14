import { Router } from 'express';

import {
  getUsers,
  postUser,
} from '../controllers/usersController';

const router = Router();

// GET /api/users -> list user ids and names
router.get('/', getUsers);

// POST /api/users -> create a user with hashed password
router.post('/', postUser);

export default router;
