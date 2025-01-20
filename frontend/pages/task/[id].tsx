import { GetServerSideProps } from 'next';
import { useState } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';

type Task = {
  id: number;
  title: string;
  color: string;
  completed: boolean;
};

type Props = {
  task?: Task;
};

export const getServerSideProps: GetServerSideProps = async ({ params }) => {
  const { id } = params as { id: string };
  let task = null;

  if (id !== 'new') {
    const res = await fetch(`http://localhost:4000/tasks/${id}`);
    if (res.ok) {
      task = await res.json();
    }
  }

  return { props: { task } };
};

const TaskForm = ({ task }: Props) => {
  const [title, setTitle] = useState(task?.title || '');
  const [color, setColor] = useState(task?.color || 'blue');
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const method = task ? 'PUT' : 'POST';
    const url = task ? `http://localhost:4000/tasks/${task.id}` : 'http://localhost:4000/tasks';

    const res = await fetch(url, {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ title, color }),
    });

    if (res.ok) {
      router.push('/');
    } else {
      alert('Error saving the task!');
    }
  };

  console.log(task)

  return (
    <div className="p-8">
      <h1 className="text-3xl mb-4">{task ? 'Edit Task' : 'Create Task'}</h1>

      <Link href="/">
        <button className="p-2 bg-gray-500 text-white rounded mb-4">
          Home
        </button>
      </Link>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block">Title</label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="input input-bordered w-full"
            required
          />
        </div>
        <div>
          <label className="block">Color</label>
          <select
            value={color}
            onChange={(e) => setColor(e.target.value)}
            className="input input-bordered w-full"
          >
            <option value="blue">Blue</option>
            <option value="green">Green</option>
            <option value="red">Red</option>
          </select>
        </div>
        <button type="submit" className="btn btn-primary mt-4">
          {task ? 'Save' : 'Add Task'}
        </button>
      </form>
    </div>
  );
};

export default TaskForm;
