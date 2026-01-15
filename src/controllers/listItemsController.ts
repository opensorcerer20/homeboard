import {
  Request,
  Response,
} from 'express';

import {
  createListItem,
  getListItems,
  validateCreateListItem,
} from '../services/listItemsService';

export function getListItemsHandler(req: Request, res: Response) {
  const category = typeof req.query.category === 'string' ? req.query.category : undefined;
  const items = getListItems(category);
  res.json({ items });
}

export function postListItemHandler(req: Request, res: Response) {
  const validation = validateCreateListItem(req.body, true);
  if (!validation.success) {
    const message = validation.errors[0]?.message ?? 'invalid input';
    return res.status(400).json({ error: message, errors: validation.errors });
  }

  try {
    const result = createListItem({ name: req.body.name, category: req.body.category ?? null });
    return res.status(201).json(result);
  } catch (err) {
    return res.status(500).json({ error: 'failed to create list item' });
  }
}
