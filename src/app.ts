import express from 'express';

import { initDb } from './models/db';
import listItemsRouter from './routes/listItems';
import tasksRouter from './routes/tasks';
import usersRouter from './routes/users';

const app = express();

app.use(express.json());

app.get('/', (req, res) => {
  res.send('Test message');
});

// Initialize database (pragmas, connection)
initDb();

// API routes
app.use('/api/users', usersRouter);
app.use('/api/list-items', listItemsRouter);
app.use('/api/tasks', tasksRouter);

export default app;
