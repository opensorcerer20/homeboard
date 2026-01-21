import { getBoard, getUsers, } from './repository.js';
export function renderHome(req, res, { boardUrl }) {
    const users = getUsers();
    const board = getBoard();
    const fallbackUser = {
        id: 0,
        name: 'Unknown',
        color: '#4a5568',
    };
    const messages = board.messages.map((msg) => {
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
export function renderLogin(req, res) {
    res.render('user', {
        currentPage: 'login',
    });
}
