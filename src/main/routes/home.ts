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
}
