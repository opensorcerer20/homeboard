import express from 'express';
import path from 'path';

import { initDb } from './models/db';
import listItemsRouter from './routes/listItems';
import tasksRouter from './routes/tasks';
import usersRouter from './routes/users';
import { getListItems } from './services/listItemsService';
import { listTasks } from './services/tasksService';

const app = express();

// View engine setup (EJS)
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.use(express.json());

// Static assets (if needed later)
app.use(express.static(path.join(__dirname, 'public')));

app.get('/', (req, res) => {
  const groceries = getListItems('groceries');
  const shopping = getListItems('shopping');
  const chores = listTasks({ category: 'chore' });
  const reminders = listTasks({ category: 'reminder' });

  res.render('index', {
    title: 'Home Board',
    subtitle: 'Family Bulletin Board',
    groceries,
    shopping,
    chores,
    reminders,
  });
});

// Initialize database (pragmas, connection)
initDb();

// API routes
app.use('/api/users', usersRouter);
app.use('/api/list-items', listItemsRouter);
app.use('/api/tasks', tasksRouter);

export default app;
