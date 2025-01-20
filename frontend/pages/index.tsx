import { GetServerSideProps } from 'next';
import Link from 'next/link';
import { useState, useEffect } from 'react';

type Task = {
  id: number;
  title: string;
  color: string;
  completed: boolean;
};

type Props = {
  tasks: Task[];
};

export const getServerSideProps: GetServerSideProps = async () => {
  const res = await fetch('http://localhost:4000/tasks');
  const tasks = await res.json();
  return { props: { tasks } };
};

const Home = ({ tasks }: Props) => {

  const [taskList, setTaskList] = useState<Task[]>(tasks); // Initialize with server-side data

  useEffect(() => {
    setTaskList(tasks); // Set tasks if props change
  }, [tasks]);
  
  const handleToggleCompletion = async (id: number, completed: boolean) => {
    await fetch(`http://localhost:4000/tasks/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ completed: !completed }),
    });

    // Update state to reflect the completion status change
    setTaskList((prevTasks) =>
        prevTasks.map((task) =>
          task.id === id ? { ...task, completed: !completed } : task
        )
    );
  };

  const handleDelete = async (id: number) => {
    if (confirm('Are you sure you want to delete this task?')) {
      await fetch(`http://localhost:4000/tasks/${id}`, { method: 'DELETE' });

      // Remove the deleted task from the state
      setTaskList((prevTasks) => prevTasks.filter((task) => task.id !== id));
    }
  };

  // Calculate total tasks and completed tasks
  const totalTasks = taskList.length;
  const completedTasks = taskList.filter((task) => task.completed).length;

  return (
    <div className="p-8">
      <h1 className="text-3xl mb-4">Todo List</h1>
      <Link href="/task/new" className="btn btn-primary">
        Create Task
      </Link>

      {/* Display total tasks and completed tasks */}
      <div className="mt-4 mb-6">
        <p className="text-lg">
          Tasks {totalTasks} | Completed {completedTasks}
        </p>
      </div>

      {totalTasks === 0 ? (
        <div>
            <p className="text-lg text-gray-500">You don't have any tasks registered yet.</p>
            <p className="text-lg text-gray-500">Create tasks and organize your to-do items.</p>
        </div>
      ) : (
        <div className="mt-4">
            <ul>
            {taskList.map((task) => (
                <li key={task.id} className="flex items-center justify-between p-2 border-b">
                <Link 
                    href={`/task/${task.id}`}
                    style={{ color: task.color }}
                    className={task.completed ? 'line-through' : ''}
                >
                    {task.title}
                </Link>
                <div>
                    <button
                    onClick={() => handleToggleCompletion(task.id, task.completed)}
                    className="mr-2 p-1 bg-blue-500 text-white"
                    >
                    {task.completed ? 'Mark as Incomplete' : 'Mark as Complete'}
                    </button>
                    <button
                    onClick={() => handleDelete(task.id)}
                    className="p-1 bg-red-500 text-white"
                    >
                    Delete
                    </button>
                </div>
                </li>
            ))}
            </ul>
        </div>
        )}
    </div>
  );
};

export default Home;
