import { getBoard, getUsers } from './repository.js';

// Controller for the home board page
export function renderHome(req, res, { boardUrl }) {
  const users = getUsers();
  const board = getBoard();

  const messages = board.messages.map((msg) => {
    const user = users.find((u) => u.id === msg.userId) || {
      name: 'Unknown',
      color: '#4a5568',
    };

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
  });
}
