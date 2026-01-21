import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

import {
  BoardDataSchema,
  BoardMessageSchema,
  ChoreSchema,
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

  const data: unknown = parsed ?? {};
  const dataObj = (typeof data === 'object' && data !== null ? data : {}) as {
    users?: unknown;
    board?: unknown;
  };

  const usersRaw = Array.isArray(dataObj.users) ? dataObj.users : [];
  const boardRaw =
    typeof dataObj.board === 'object' && dataObj.board !== null ? dataObj.board : {};

  const validUsers = usersRaw
    .map((u: unknown) => UserSchema.safeParse(u))
    .filter((r) => r.success)
    .map((r) => r.data);

  const cleanStringArray = (value: unknown): string[] =>
    Array.isArray(value) ? value.filter((v) => typeof v === 'string') : [];

  const boardObj = boardRaw as {
    title?: unknown;
    subtitle?: unknown;
    groceries?: unknown;
    shopping?: unknown;
    reminders?: unknown;
    chores?: unknown;
    messages?: unknown;
  };

  const messagesRaw = Array.isArray(boardObj.messages)
    ? boardObj.messages
    : [];

  const validMessages = messagesRaw
    .map((m: unknown) => BoardMessageSchema.safeParse(m))
    .filter((r) => r.success)
    .map((r) => r.data);

  const choresRaw = Array.isArray(boardObj.chores)
    ? boardObj.chores
    : [];

  const validChores = choresRaw
    .map((c: unknown) => ChoreSchema.safeParse(c))
    .filter((r) => r.success)
    .map((r) => r.data);

  const partialBoard = {
    title: typeof boardObj.title === 'string' ? boardObj.title : '',
    subtitle: typeof boardObj.subtitle === 'string' ? boardObj.subtitle : '',
    groceries: cleanStringArray(boardObj.groceries),
    shopping: cleanStringArray(boardObj.shopping),
    reminders: cleanStringArray(boardObj.reminders),
    chores: validChores,
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
