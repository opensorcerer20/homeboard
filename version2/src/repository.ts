// Simple repository that reads board data from a JSON resource on disk.
// This keeps the implementation minimal while allowing the data file
// to be updated in the future without changing application code.

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { z } from 'zod';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const DATA_PATH = path.join(__dirname, '..', 'data', 'boardData.json');

export const UserSchema = z.object({
  id: z.number(),
  name: z.string(),
  color: z.string(),
});

export const BoardMessageSchema = z.object({
  userId: z.number(),
  text: z.string(),
  at: z.string().datetime(),
});

export const ChoreSchema = z.object({
  userId: z.number().optional(),
  text: z.string(),
  completed: z.boolean().optional().default(false),
});

export const BoardSchema = z.object({
  groceries: z.array(z.string()),
  shopping: z.array(z.string()),
  reminders: z.array(z.string()),
  chores: z.array(ChoreSchema),
  messages: z.array(BoardMessageSchema),
});

export const BoardDataSchema = z.object({
  users: z.array(UserSchema),
  board: BoardSchema,
});

export type User = z.infer<typeof UserSchema>;
export type BoardMessage = z.infer<typeof BoardMessageSchema>;
export type Chore = z.infer<typeof ChoreSchema>;
export type Board = z.infer<typeof BoardSchema>;
export type BoardData = z.infer<typeof BoardDataSchema>;
let cachedData: BoardData | null = null;

function loadFromDisk(): BoardData {
  try {
    const raw = fs.readFileSync(DATA_PATH, 'utf8');
    const parsed = JSON.parse(raw);
    return BoardDataSchema.parse(parsed);
  } catch (err) {
    const nodeErr = err as NodeJS.ErrnoException;
    if (nodeErr.code === 'ENOENT') {
      const initial: BoardData = BoardDataSchema.parse({
        users: [
          {
            id: 1,
            name: 'admin',
            color: '#2b6cb0',
          },
        ],
        board: {
          groceries: [],
          shopping: [],
          reminders: [],
          chores: [],
          messages: [],
        },
      });

      const dir = path.dirname(DATA_PATH);
      if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
      }

      const json = JSON.stringify(initial, null, 2);
      fs.writeFileSync(DATA_PATH, json, 'utf8');

      return initial;
    }

    throw err;
  }
}

export function initializeBoardData(): void {
  if (cachedData == null) {
    cachedData = loadFromDisk();
  }
}

export function loadData(): BoardData {
  if (cachedData == null) {
    cachedData = loadFromDisk();
  }
  return cachedData;
}

export function saveBoardData(data: BoardData): void {
  cachedData = data;
  const json = JSON.stringify(data, null, 2);
  fs.writeFileSync(DATA_PATH, json, 'utf8');
}

export function ensureBoardDataIsValid(): void {
  // Will throw if JSON is missing or invalid; callers can decide how to handle.
  initializeBoardData();
}

export function getUsers(): User[] {
  const data = loadData();
  return data.users ?? [];
}

export function getBoard(): Board {
  const data = loadData();
  return data.board;
}
