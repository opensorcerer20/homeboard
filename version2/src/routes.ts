import express, {
  type Request,
  type Response,
} from 'express';

import {
  renderHome,
  renderLogin,
} from './controllers.js';

interface RoutesDeps {
  getBoardUrl: () => string;
}

// Factory so the server can provide how to compute the board URL
export function createRoutes({ getBoardUrl }: RoutesDeps): express.Router {
  const router = express.Router();

  router.get('/', (req: Request, res: Response) => {
    const boardUrl = getBoardUrl();
    renderHome(req, res, { boardUrl });
  });

  router.get('/login', (req: Request, res: Response) => {
    renderLogin(req, res);
  });

  return router;
}
