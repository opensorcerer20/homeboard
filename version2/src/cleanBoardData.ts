import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

import {
  BoardDataSchema,
  BoardMessageSchema,
  UserSchema,
} from './repository.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const DATA_PATH = path.join(__dirname, '..', 'data', 'boardData.json');

function clean() {
  const raw = fs.readFileSync(DATA_PATH, 'utf8');
  let parsed: unknown;

  try {
    parsed = JSON.parse(raw);
  } catch (err) {
    console.error('Failed to parse boardData.json as JSON; resetting to empty structure.');
    const empty = {
      users: [],
      board: {
        title: '',
        subtitle: '',
        groceries: [],
        shopping: [],
        reminders: [],
        chores: [],
        messages: [],
      },
    };
    fs.writeFileSync(DATA_PATH, JSON.stringify(empty, null, 2) + '\n', 'utf8');
    return;
  }

  // If the whole document is already valid, just normalize and rewrite.
  const asBoardData = BoardDataSchema.safeParse(parsed);
  if (asBoardData.success) {
    fs.writeFileSync(DATA_PATH, JSON.stringify(asBoardData.data, null, 2) + '\n', 'utf8');
    console.log('boardData.json is already valid; normalized formatting.');
    return;
  }

  const data: any = parsed ?? {};
  const usersRaw = Array.isArray(data.users) ? data.users : [];
  const boardRaw = typeof data.board === 'object' && data.board !== null ? data.board : {};

  const validUsers = usersRaw
    .map((u: unknown) => UserSchema.safeParse(u))
    .filter((r) => r.success)
    .map((r) => r.data);

  const cleanStringArray = (value: unknown): string[] =>
    Array.isArray(value) ? value.filter((v) => typeof v === 'string') : [];

  const messagesRaw = Array.isArray((boardRaw as any).messages)
    ? (boardRaw as any).messages
    : [];

  const validMessages = messagesRaw
    .map((m: unknown) => BoardMessageSchema.safeParse(m))
    .filter((r) => r.success)
    .map((r) => r.data);

  const partialBoard = {
    title: typeof (boardRaw as any).title === 'string' ? (boardRaw as any).title : '',
    subtitle:
      typeof (boardRaw as any).subtitle === 'string' ? (boardRaw as any).subtitle : '',
    groceries: cleanStringArray((boardRaw as any).groceries),
    shopping: cleanStringArray((boardRaw as any).shopping),
    reminders: cleanStringArray((boardRaw as any).reminders),
    chores: cleanStringArray((boardRaw as any).chores),
    messages: validMessages,
  };

  // Ensure the reconstructed object fully matches the schema (will throw if not).
  const cleaned = BoardDataSchema.parse({
    users: validUsers,
    board: partialBoard,
  });

  fs.writeFileSync(DATA_PATH, JSON.stringify(cleaned, null, 2) + '\n', 'utf8');
  console.log('boardData.json cleaned successfully.');
}

clean();
