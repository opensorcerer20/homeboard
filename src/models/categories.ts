export const CATEGORIES = {
  GROCERIES: 'groceries',
  SHOPPING: 'shopping',
  CHORE: 'chore',
  REMINDER: 'reminder',
} as const;

export const CATEGORY = CATEGORIES;

export type Category = (typeof CATEGORIES)[keyof typeof CATEGORIES];
