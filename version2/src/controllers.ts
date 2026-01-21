import type {
  Request,
  Response,
} from 'express';

import {
  type Board,
  type BoardMessage,
  getBoard,
  getUsers,
  type User,
} from './repository.js';

interface RenderContext {
  boardUrl: string;
}

// Controller for the home board page
export interface EnrichedMessage extends BoardMessage {
  userName: string;
  userColor: string;
}

export function renderHome(req: Request, res: Response, { boardUrl }: RenderContext): void {
  const users: User[] = getUsers();
  const board: Board = getBoard();

  const fallbackUser: User = {
    id: 0,
    name: 'Unknown',
    color: '#4a5568',
  };

  const messages: EnrichedMessage[] = board.messages.map((msg: BoardMessage) => {
    const user = users.find((u) => u.id === msg.userId) ?? fallbackUser;

    return {
      ...msg,
      userName: user.name,
      userColor: user.color,
    };
  });

  res.render('board', {
    board,
    users,
    messages,
    boardUrl,
    currentPage: 'home',
  });
}

export function renderLogin(req: Request, res: Response): void {
  res.render('user', {
    currentPage: 'login',
  });
}
