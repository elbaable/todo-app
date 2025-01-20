import express, { Request, Response } from 'express';
import bodyParser from 'body-parser';
import cors from 'cors'; // Import the CORS package
import { PrismaClient } from '@prisma/client';

const app = express();
const prisma = new PrismaClient();

// Enable CORS for all origins (or specify your frontend origin if needed)
app.use(cors());

app.use(bodyParser.json());

// Get all tasks
app.get('/tasks', async (req: Request, res: Response) => {
  try {
    const tasks = await prisma.task.findMany();
    res.json(tasks);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching tasks' });
  }
});

// Create a new task
app.post('/tasks', async (req: Request, res: Response) => {
  const { title, color } = req.body;
  try {
    const newTask = await prisma.task.create({
      data: {
        title,
        color,
      },
    });
    res.status(201).json(newTask);
  } catch (error) {
    res.status(500).json({ message: 'Error creating task' });
  }
});

// Get a task
app.get('/tasks/:id', async (req: Request, res: Response) => {
    const { id } = req.params;
    try {
        const task = await prisma.task.findUnique({
            where: { id: parseInt(id) },
        });
        
        res.json(task);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching task' });
    }
});  

// Update a task
app.put('/tasks/:id', async (req: Request, res: Response) => {
  const { id } = req.params;
  const { title, color, completed } = req.body;
  try {
    const updatedTask = await prisma.task.update({
      where: { id: parseInt(id) },
      data: { title, color, completed },
    });
    res.json(updatedTask);
  } catch (error) {
    res.status(500).json({ message: 'Error updating task' });
  }
});

// Delete a task
app.delete('/tasks/:id', async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    await prisma.task.delete({
      where: { id: parseInt(id) },
    });
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ message: 'Error deleting task' });
  }
});

// Start the server
const PORT = 4000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
