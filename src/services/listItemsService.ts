import {
  insertListItem,
  listAllItems,
  listItemsByCategory,
  PublicListItem,
  updateSorting,
} from '../repositories/listItemsRepository';

export interface CreateListItemInput {
  name: string;
  category?: string | null;
  sorting?: number;
}

export function validateCreateListItem({ name, category, sorting }: Partial<CreateListItemInput>): string | null {
  if (typeof name !== 'string' || name.trim().length === 0) return 'name is required';
  if (category !== undefined && category !== null && typeof category !== 'string') return 'category must be a string or null';
  if (sorting !== undefined && !Number.isInteger(sorting)) return 'sorting must be an integer';
  return null;
}

export function createListItem({ name, category = null, sorting = 0 }: CreateListItemInput): { id: number; name: string; category: string | null; sorting: number } {
  const normalizedName = name.trim();
  const id = insertListItem(normalizedName, category, sorting);
  return { id, name: normalizedName, category, sorting };
}

export function getListItems(category?: string): PublicListItem[] {
  if (typeof category === 'string') {
    return listItemsByCategory(category);
  }
  return listAllItems();
}

export function setItemSorting(id: number, sorting: number): boolean {
  if (!Number.isInteger(sorting)) throw new Error('invalid-sorting');
  return updateSorting(id, sorting);
}
