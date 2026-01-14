import { Router } from 'express';

import {
  getListItemsHandler,
  postListItemHandler,
} from '../controllers/listItemsController';

const router = Router();

// GET /api/list-items?category=
router.get('/', getListItemsHandler);

// POST /api/list-items
router.post('/', postListItemHandler);

// sorting removed from schema; no sorting route

export default router;
