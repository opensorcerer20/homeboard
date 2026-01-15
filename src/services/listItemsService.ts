import {
  CreateListItemInput,
  createListItemSchema,
} from '../models/listItemModel';
import {
  insertListItem,
  listAllItems,
  listItemsByCategory,
  PublicListItem,
} from '../repositories/listItemsRepository';
import {
  validateSchema,
  ValidationResult,
} from '../validation/zodHelpers';

export function validateCreateListItem(input: Partial<CreateListItemInput>): string | null;
export function validateCreateListItem(
  input: Partial<CreateListItemInput>,
  detailed: true,
): ValidationResult<CreateListItemInput>;
export function validateCreateListItem(
  input: Partial<CreateListItemInput>,
  detailed: boolean = false,
): string | null | ValidationResult<CreateListItemInput> {
  const result = validateSchema(createListItemSchema, input);
  if (detailed) {
    return result;
  }
  if (!result.success) {
    return result.errors[0]?.message ?? 'invalid input';
  }
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
