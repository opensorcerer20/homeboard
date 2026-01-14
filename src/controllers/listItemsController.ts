import {
  Request,
  Response,
} from 'express';

import {
  createListItem,
  getListItems,
  setItemSorting,
  validateCreateListItem,
} from '../services/listItemsService';

export function getListItemsHandler(req: Request, res: Response) {
  const category = typeof req.query.category === 'string' ? req.query.category : undefined;
  const items = getListItems(category);
  res.json({ items });
}

export function postListItemHandler(req: Request, res: Response) {
  const error = validateCreateListItem(req.body);
  if (error) return res.status(400).json({ error });

  try {
    const result = createListItem({ name: req.body.name, category: req.body.category ?? null, sorting: req.body.sorting ?? 0 });
    return res.status(201).json(result);
  } catch (err) {
    return res.status(500).json({ error: 'failed to create list item' });
  }
}

export function patchListItemSortingHandler(req: Request, res: Response) {
  const id = Number(req.params.id);
  const sorting = req.body?.sorting;
  if (!Number.isInteger(id) || id <= 0) return res.status(400).json({ error: 'invalid id' });
  if (!Number.isInteger(sorting)) return res.status(400).json({ error: 'sorting must be an integer' });

  try {
    const ok = setItemSorting(id, Number(sorting));
    if (!ok) return res.status(404).json({ error: 'item not found' });
    return res.status(200).json({ id, sorting: Number(sorting) });
  } catch (err: any) {
    if (err?.message === 'invalid-sorting') return res.status(400).json({ error: 'sorting must be an integer' });
    return res.status(500).json({ error: 'failed to update sorting' });
  }
}
