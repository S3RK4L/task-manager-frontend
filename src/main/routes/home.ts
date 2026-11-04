import axios from 'axios';
import { Application } from 'express';

export default function (app: Application): void {
  app.get('/', async (req, res) => {
    // try {
    //   // An example of connecting to the backend (a starting point)
    //   const response = await axios.get('http://localhost:4000/get-example-case');
    //   console.log(response.data);
    //   res.render('home', { example: response.data });
    // } catch (error) {
    //   console.error('Error making request:', error);
    //   res.render('home', {});
    // }

    try {
      // An example of connecting to the backend (a starting point)
      const response = await axios.get('http://localhost:4000/tasks');
      console.log(response.data);

      // Keeping the original task data and adding a new property for the formatted due date
      // This way, you can use the original dueDate for any logic and the formatted version for display
      const tasks = response.data.map((task: { dueDate: string | number | Date }) => {
        const d = new Date(task.dueDate);
        const date = new Intl.DateTimeFormat('en-GB', { dateStyle: 'long' }).format(d);
        const time = new Intl.DateTimeFormat('en-GB', { timeStyle: 'short' }).format(d);
        return { ...task, dueDateFormatted: `${date} at ${time}` };
      });
      res.render('home', { tasks });
    } catch (error) {
      console.error('Error making request:', error);
      res.render('home', {});
    }
  });

  app.get('/tasks/new', (req, res) => {
    res.render('create-task');
  });

  app.post('/tasks/new', async (req, res) => {
    const { title, description, status } = req.body;
    const day = req.body['dueDate-day'].padStart(2, '0');
    const month = req.body['dueDate-month'].padStart(2, '0');
    const year = req.body['dueDate-year'];

    try {
      await axios.post('http://localhost:4000/tasks', {
        title,
        description,
        status,
        dueDate: `${year}-${month}-${day}T${req.body.dueTime}:00`,
      });
      res.redirect('/');
    } catch (error) {
      console.error('Error creating task:', error);
      res.render('create-task', { error: 'Failed to create task. Please try again.' });
    }
  });

  app.get('/tasks/:id', async (req, res) => {
    try {
      // An example of connecting to the backend (a starting point)
      const response = await axios.get(`http://localhost:4000/tasks/${req.params.id}`);

      // Keeping the original task data and adding a new property for the formatted due date
      // This way, you can use the original dueDate for any logic and the formatted version for display
      const task = response.data;
      const d = new Date(task.dueDate);
      const date = new Intl.DateTimeFormat('en-GB', { dateStyle: 'long' }).format(d);
      const time = new Intl.DateTimeFormat('en-GB', { timeStyle: 'short' }).format(d);
      task.dueDateFormatted = `${date} at ${time}`;

      res.render('task', { task });
    } catch (error) {
      console.error('Error making request:', error);
      if (error.response?.status === 404) {
        return res.status(404).render('not-found');
      }
    }
  });
}
