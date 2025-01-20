import { GetServerSideProps } from 'next';
import { useState } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import Image from 'next/image';

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
  const [color, setColor] = useState(task?.color || '#FF3B30');
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

  return (
    <div className="bg-backgroundColor">
      <div className="h-[200px] bg-headerColor">
        <div className="p-48px text-[40px] font-extraHeavy flex justify-center align-center">
          <Image
            src="/img/rocket.png"
            alt="Todo App Rocket"
            width={20}
            height={20}
            style={{width: '30px', height: '45px', marginTop: '10px'}}
          />
          <span className="text-customBlue ml-2">Todo</span>
          <span className="text-customPurple ml-2">App</span>
        </div>
      </div>
      <div className="w-[736px] min-h-[511px] m-auto mt-[26px] mb-[18px] py-10">
        <Link href="/">
          <button className="w-[24px]">
            <Image
              src="/img/arrow-left.png"
              alt="Todo App Rocket"
              width={50}
              height={50}
            />
          </button>
        </Link>
        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="text-customBlue">Title</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="input bg-inputBox w-full rounded-[8px] h-[52px] text-inputText p-5 mt-2"
              placeholder="Ex. Brush your teeth"
              required
            />
          </div>
          <div>
            <label className="text-customBlue">Color</label>
            <div className="flex space-x-4">
              {['#FF3B30', '#FF9500', '#FFCC00', '#34C759', '#007AFF', '#5856D6', '#AF52DE', '#FF2D55', '#A2845E'].map((colorOption) => (
                <div
                  key={colorOption}
                  onClick={() => setColor(colorOption)}
                  className={`w-[52px] h-[52px] rounded-full cursor-pointer ${
                    color === colorOption ? 'border-2 border-white' : ''
                  }`}
                  style={{
                    backgroundColor: colorOption,
                  }}
                />
              ))}
            </div>
          </div>
          <button type="submit" className="btn btn-primary mt-4">
            <div className="btn flex justify-center items-center bg-customBtn w-[736px] h-[52px] rounded-[8px] text-white text-[14px]">
              <span className="mr-2">{task ? 'Save' : 'Add Task'}</span>
              {task ? (
                <Image
                src="/img/save.png"
                alt="Add a new task"
                width={20}
                height={20}
              />
              ) : (
                <Image
                  src="/img/add.png"
                  alt="Add a new task"
                  width={20}
                  height={20}
                />
              )}
            </div>
          </button>
        </form>
      </div>
    </div>
  );
};

export default TaskForm;
