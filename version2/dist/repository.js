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
    at: z.string(),
});
export const BoardSchema = z.object({
    title: z.string(),
    subtitle: z.string(),
    groceries: z.array(z.string()),
    shopping: z.array(z.string()),
    reminders: z.array(z.string()),
    chores: z.array(z.string()),
    messages: z.array(BoardMessageSchema),
});
export const BoardDataSchema = z.object({
    users: z.array(UserSchema),
    board: BoardSchema,
});
function loadData() {
    const raw = fs.readFileSync(DATA_PATH, 'utf8');
    const parsed = JSON.parse(raw);
    return BoardDataSchema.parse(parsed);
}
export function ensureBoardDataIsValid() {
    // Will throw if JSON is missing or invalid; callers can decide how to handle.
    loadData();
}
export function getUsers() {
    const data = loadData();
    return data.users ?? [];
}
export function getBoard() {
    const data = loadData();
    return data.board;
}
