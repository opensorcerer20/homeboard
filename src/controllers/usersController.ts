import {
  Request,
  Response,
} from 'express';

import {
  createUser,
  listUsers,
  validateCreateUser,
} from '../services/usersService';

export function getUsers(_req: Request, res: Response) {
  const users = listUsers();
  res.json({ users });
}

export function postUser(req: Request, res: Response) {
  const error = validateCreateUser(req.body);
  if (error) return res.status(400).json({ error });

  try {
    const result = createUser({ name: req.body.name, password: req.body.password });
    return res.status(201).json(result);
  } catch (err: any) {
    if (err?.message === 'duplicate-name') {
      return res.status(409).json({ error: 'user with this name already exists' });
    }
    return res.status(500).json({ error: 'failed to create user' });
  }
}
