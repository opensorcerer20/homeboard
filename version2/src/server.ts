import express from 'express';
import os from 'os';
import path from 'path';
import { fileURLToPath } from 'url';

import { ensureBoardDataIsValid } from './repository.js';
import { createRoutes } from './routes.js';

const app = express();
const PORT = process.env.PORT ? Number(process.env.PORT) : 4000;

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

function getLocalIp(): string {
  const nets = os.networkInterfaces();
  for (const name of Object.keys(nets)) {
    for (const net of nets[name] || []) {
      if (net && net.family === 'IPv4' && !net.internal) {
        return net.address;
      }
    }
  }
  return 'localhost';
}

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, '..', 'views'));

app.use(express.static(path.join(__dirname, '..', 'public')));

function getBoardUrl(): string {
  const ip = getLocalIp();
  return `http://${ip}:${PORT}`;
}

try {
  // Validate JSON data at startup; exit if invalid.
  ensureBoardDataIsValid();
} catch (err) {
  console.error('Failed to validate boardData.json on startup:');
  console.error(err);
  process.exit(1);
}

app.use('/', createRoutes({ getBoardUrl }));

app.listen(PORT, () => {
  const boardUrl = getBoardUrl();
  console.log(`Homeboard v2 is running at ${boardUrl}`);
});
