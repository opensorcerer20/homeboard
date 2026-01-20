import express from 'express';
import os from 'os';
import path from 'path';
import { fileURLToPath } from 'url';

import { createRoutes } from './routes.js';

const app = express();
const PORT = process.env.PORT || 4000;

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

function getLocalIp() {
  const nets = os.networkInterfaces();
  for (const name of Object.keys(nets)) {
    for (const net of nets[name] || []) {
      if (net.family === 'IPv4' && !net.internal) {
        return net.address;
      }
    }
  }
  return 'localhost';
}

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, '..', 'views'));

app.use(express.static(path.join(__dirname, '..', 'public')));

function getBoardUrl() {
  const ip = getLocalIp();
  return `http://${ip}:${PORT}`;
}

app.use('/', createRoutes({ getBoardUrl }));

app.listen(PORT, () => {
  const boardUrl = getBoardUrl();
  console.log(`Homeboard v2 is running at ${boardUrl}`);
});
