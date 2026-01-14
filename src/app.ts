import express from 'express';

import { initDb } from './models/db';
import { initListItemsRepository } from './repositories/listItemsRepository';
import { initUsersRepository } from './repositories/usersRepository';
import listItemsRouter from './routes/listItems';
import usersRouter from './routes/users';

const app = express();

app.use(express.json());

app.get('/', (req, res) => {
  res.send('Test message');
});

// Initialize database and repositories
initDb();
// note: use migration tool when more tables are added
initUsersRepository();
initListItemsRepository();

// API routes
app.use('/api/users', usersRouter);
app.use('/api/list-items', listItemsRouter);

export default app;
