import { Router } from 'express';

import {
  getListItemsHandler,
  patchListItemSortingHandler,
  postListItemHandler,
} from '../controllers/listItemsController';

const router = Router();

// GET /api/list-items?category=
router.get('/', getListItemsHandler);

// POST /api/list-items
router.post('/', postListItemHandler);

// PATCH /api/list-items/:id/sorting
router.patch('/:id/sorting', patchListItemSortingHandler);

export default router;
