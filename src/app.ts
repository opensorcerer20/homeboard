import express from 'express';

import { initDb } from './models/db';
import { initUsersRepository } from './repositories/usersRepository';
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

// API routes
app.use('/api/users', usersRouter);

export default app;
