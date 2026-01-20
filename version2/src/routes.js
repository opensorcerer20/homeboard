import express from 'express';

import { renderHome } from './controllers.js';

// Factory so the server can provide how to compute the board URL
export function createRoutes({ getBoardUrl }) {
  const router = express.Router();

  router.get('/', (req, res) => {
    const boardUrl = getBoardUrl();
    renderHome(req, res, { boardUrl });
  });

  return router;
}
