import { GetServerSideProps } from 'next';
import Link from 'next/link';
import { useState, useEffect } from 'react';
import Image from 'next/image';

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
      <div className="flex justify-center mt-[-26px]">
        <Link href="/task/new">
          <div className="btn flex justify-center items-center bg-customBtn w-[736px] h-[52px] rounded-[8px] text-white text-[14px]">
            <span className="mr-2">Create Task</span>
            <Image
              src="/img/add.png"
              alt="Add a new task"
              width={20}
              height={20}
            />
          </div>
        </Link>
      </div>

      <div className="w-[736px] min-h-[511px] m-auto py-10">
        {/* Display total tasks and completed tasks */}
        <div className="flex justify-between mb-6">
          <div><span className="text-customBlue mr-2">Tasks</span> <span className="rounded-full bg-customBadge text-customBadgeText px-2">{totalTasks}</span></div>
          <div><span className="text-customBlue mr-2">Completed</span> <span className="rounded-full bg-customBadge text-customBadgeText px-2">{completedTasks} de {totalTasks}</span></div>
        </div>

        {totalTasks === 0 ? (
          <div className="text-center">
              <Image
                src="/img/Clipboard.png"
                alt="No task"
                width={56}
                height={56}
                style={{margin: '20px auto'}}
              />
              <div className="text-lg text-noTaskText font-bold mb-6">You don't have any tasks registered yet.</div>
              <div className="text-lg text-noTaskText font-middle">Create tasks and organize your to-do items.</div>
          </div>
        ) : (
          <div className="mt-4">
              <ul>
              {taskList.map((task) => (
                  <li key={task.id} className="flex items-center justify-between p-2 border-b">
                    <button
                      onClick={() => handleToggleCompletion(task.id, task.completed)}
                      className="mr-2"
                      >
                      {task.completed ? (
                        <div className="w-[24px]">
                          <Image
                            src="/img/check.png"
                            alt="Completed task"
                            width={24}
                            height={24}
                          />
                        </div>
                      ) : (
                        <div className="w-[24px]">
                          <Image
                            src="/img/uncheck.png"
                            alt="Umcompleted task"
                            width={24}
                            height={24}
                          />
                        </div>
                      )}
                    </button>
                    <Link 
                        href={`/task/${task.id}`}
                        style={{ color: task.color }}
                        className={task.completed ? 'line-through opacity-50' : ''}
                    >
                        {task.title}
                    </Link>
                      <button
                      onClick={() => handleDelete(task.id)}
                      className="ml-2"
                      >
                        <div className="w-[24px]">
                          <Image
                            src="/img/remove.png"
                            alt="Remove task"
                            width={24}
                            height={24}
                          />
                        </div>
                      </button>
                  </li>
              ))}
              </ul>
          </div>
        )}
        </div>
    </div>
  );
};

export default Home;
