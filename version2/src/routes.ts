import express, {
  type Request,
  type Response,
} from 'express';
import { z } from 'zod';

import {
  renderHome,
  renderLogin,
} from './controllers.js';
import { BoardService } from './services/boardService.js';

interface RoutesDeps {
  getBoardUrl: () => string;
}

// Factory so the server can provide how to compute the board URL
export function createRoutes({ getBoardUrl }: RoutesDeps): express.Router {
  const router = express.Router();
  const boardService = new BoardService();

  router.get('/', (req: Request, res: Response) => {
    const boardUrl = getBoardUrl();
    renderHome(req, res, { boardUrl });
  });

  router.get('/login', (req: Request, res: Response) => {
    renderLogin(req, res);
  });

  router.post('/api/messages', async (req: Request, res: Response) => {
    try {
      const message = boardService.createMessage(req.body);
      res.status(201).json({ message });
    } catch (err) {
      if (err instanceof z.ZodError) {
        res.status(400).json({
          error: 'ValidationError',
          issues: err.issues,
        });
        return;
      }

      // eslint-disable-next-line no-console
      console.error('Failed to create message', err);
      res.status(500).json({ error: 'InternalServerError' });
    }
  });

  router.post('/api/chores/update', async (req: Request, res: Response) => {
    try {
      const chore = boardService.updateChore(req.body);
      res.status(200).json({ chore });
    } catch (err) {
      if (err instanceof z.ZodError) {
        res.status(400).json({
          error: 'ValidationError',
          issues: err.issues,
        });
        return;
      }

      if (err instanceof Error && err.message === 'ChoreNotFound') {
        res.status(404).json({ error: 'ChoreNotFound' });
        return;
      }

      // eslint-disable-next-line no-console
      console.error('Failed to complete chore', err);
      res.status(500).json({ error: 'InternalServerError' });
    }
  });

  router.post('/api/groceries', async (req: Request, res: Response) => {
    try {
      const groceries = boardService.updateGroceries(req.body);
      res.status(200).json({ groceries });
    } catch (err) {
      if (err instanceof z.ZodError) {
        res.status(400).json({
          error: 'ValidationError',
          issues: err.issues,
        });
        return;
      }

      // eslint-disable-next-line no-console
      console.error('Failed to update groceries', err);
      res.status(500).json({ error: 'InternalServerError' });
    }
  });

  router.post('/api/shopping', async (req: Request, res: Response) => {
    try {
      const shopping = boardService.updateShopping(req.body);
      res.status(200).json({ shopping });
    } catch (err) {
      if (err instanceof z.ZodError) {
        res.status(400).json({
          error: 'ValidationError',
          issues: err.issues,
        });
        return;
      }

      // eslint-disable-next-line no-console
      console.error('Failed to update shopping', err);
      res.status(500).json({ error: 'InternalServerError' });
    }
  });

  return router;
}
