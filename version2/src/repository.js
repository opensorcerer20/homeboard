// Simple repository that reads board data from a JSON resource on disk.
// This keeps the implementation minimal while allowing the data file
// to be updated in the future without changing application code.
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const DATA_PATH = path.join(__dirname, '..', 'data', 'boardData.json');

function loadData() {
  const raw = fs.readFileSync(DATA_PATH, 'utf8');
  return JSON.parse(raw);
}

export function getUsers() {
  const data = loadData();
  return data.users || [];
}

export function getBoard() {
  const data = loadData();
  return data.board || {};
}
