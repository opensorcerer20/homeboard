import {
  insertListItem,
  listAllItems,
  listItemsByCategory,
  PublicListItem,
} from '../repositories/listItemsRepository';

export interface CreateListItemInput {
  name: string;
  category?: string | null;
}

export function validateCreateListItem({ name, category }: Partial<CreateListItemInput>): string | null {
  if (typeof name !== 'string' || name.trim().length === 0) return 'name is required';
  if (category !== undefined && category !== null && typeof category !== 'string') return 'category must be a string or null';
  return null;
}

export function createListItem({ name, category = null }: CreateListItemInput): { id: number; name: string; category: string | null } {
  const normalizedName = name.trim();
  const id = insertListItem(normalizedName, category);
  return { id, name: normalizedName, category };
}

export function getListItems(category?: string): PublicListItem[] {
  if (typeof category === 'string') {
    return listItemsByCategory(category);
  }
  return listAllItems();
}

// sorting removed from schema; no setter exported
