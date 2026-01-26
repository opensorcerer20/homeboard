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
  displayTime: string;
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

    const dt = new Date(msg.at);
    const displayTime = Number.isNaN(dt.getTime())
      ? msg.at
      : dt.toLocaleString(undefined, {
          month: 'short',
          day: 'numeric',
          hour: 'numeric',
          minute: '2-digit',
        });

    return {
      ...msg,
      userName: user.name,
      userColor: user.color,
      displayTime,
    };
  });

  const sortedMessages: EnrichedMessage[] = messages
    .slice()
    .sort((a, b) => new Date(b.at).getTime() - new Date(a.at).getTime());

  res.render('board', {
    board,
    users,
    messages: sortedMessages,
    boardUrl,
    currentPage: 'home',
  });
}

export function renderLogin(req: Request, res: Response): void {
  res.render('user', {
    currentPage: 'login',
  });
}
