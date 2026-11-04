import axios from 'axios';
import { Application } from 'express';

const BACKEND_URL = process.env.BACKEND_URL || 'http://localhost:4000';

// Formats an ISO date string as GOV.UK style, for example "10 November 2026 at 09:00"
function formatDueDate(dueDate: string): string {
  const d = new Date(dueDate);
  const date = new Intl.DateTimeFormat('en-GB', { dateStyle: 'long' }).format(d);
  const time = new Intl.DateTimeFormat('en-GB', { timeStyle: 'short' }).format(d);
  return `${date} at ${time}`;
}

export default function (app: Application): void {
  app.get('/', async (req, res) => {
    try {
      const response = await axios.get(`${BACKEND_URL}/tasks`);

      // Keep the original dueDate for logic, and add a formatted version for display
      const tasks = response.data.map((task: { dueDate: string }) => ({
        ...task,
        dueDateFormatted: formatDueDate(task.dueDate),
      }));

      return res.render('home', { tasks });
    } catch (error) {
      console.error('Error loading tasks:', error);
      return res.status(500).render('error', { message: 'Failed to load tasks. Please try again.' });
    }
  });

  app.get('/tasks/new', (req, res) => {
    res.render('create-task');
  });

  app.post('/tasks/new', async (req, res) => {
    const { title, description, status, dueTime } = req.body;
    const day = req.body['dueDate-day'].padStart(2, '0');
    const month = req.body['dueDate-month'].padStart(2, '0');
    const year = req.body['dueDate-year'];

    try {
      await axios.post(`${BACKEND_URL}/tasks`, {
        title,
        description,
        status,
        dueDate: `${year}-${month}-${day}T${dueTime}:00`,
      });
      return res.redirect('/');
    } catch (error) {
      console.error('Error creating task:', error);
      return res.render('create-task', { error: 'Failed to create task. Please try again.' });
    }
  });

  app.get('/tasks/:id', async (req, res) => {
    try {
      const response = await axios.get(`${BACKEND_URL}/tasks/${req.params.id}`);
      const task = { ...response.data, dueDateFormatted: formatDueDate(response.data.dueDate) };
      return res.render('task', { task });
    } catch (error) {
      if (error.response?.status === 404) {
        return res.status(404).render('not-found');
      }
      console.error('Error loading task:', error);
      return res.status(500).render('error', { message: 'Failed to fetch task. Please try again.' });
    }
  });

  app.get('/tasks/:id/delete', async (req, res) => {
    try {
      const response = await axios.get(`${BACKEND_URL}/tasks/${req.params.id}`);
      return res.render('delete-task', { task: response.data });
    } catch (error) {
      if (error.response?.status === 404) {
        return res.status(404).render('not-found');
      }
      console.error('Error loading task:', error);
      return res.status(500).render('error', { message: 'Failed to fetch task. Please try again.' });
    }
  });

  app.post('/tasks/:id/delete', async (req, res) => {
    try {
      await axios.delete(`${BACKEND_URL}/tasks/${req.params.id}`);
      return res.redirect('/');
    } catch (error) {
      if (error.response?.status === 404) {
        return res.status(404).render('not-found');
      }
      console.error('Error deleting task:', error);
      return res.status(500).render('error', { message: 'Failed to delete task. Please try again.' });
    }
  });
}
