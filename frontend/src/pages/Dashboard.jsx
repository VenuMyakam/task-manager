import { useEffect, useState } from 'react';
import api from '../api/axios';
import { useAuth } from '../context/AuthContext';
import TaskForm from '../components/TaskForm';
import TaskItem from '../components/TaskItem';

export default function Dashboard() {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const { user, logout } = useAuth();

  // Runs once when the component mounts, to load this user's tasks.
  // The JWT gets attached automatically by our axios interceptor.
  useEffect(() => {
    let cancelled = false;
    api
      .get('/tasks')
      .then(({ data }) => {
        if (!cancelled) setTasks(data);
      })
      .catch(() => {
        if (!cancelled) setError('Could not load tasks.');
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true; // avoid setting state if component unmounts mid-request
    };
  }, []);

  async function handleCreate(taskData) {
    const { data } = await api.post('/tasks', taskData);
    setTasks((prev) => [data, ...prev]);
  }

  async function handleUpdate(id, updatedFields) {
    const { data } = await api.put(`/tasks/${id}`, updatedFields);
    setTasks((prev) => prev.map((t) => (t.id === id ? data : t)));
  }

  async function handleDelete(id) {
    await api.delete(`/tasks/${id}`);
    setTasks((prev) => prev.filter((t) => t.id !== id));
  }

  const pendingCount = tasks.filter((t) => t.status !== 'completed').length;

return (
    <div className="min-h-screen bg-slate-50">
      <div className="max-w-2xl mx-auto px-6 py-12">
        <header className="flex justify-between items-start mb-8">
          <div>
            <h1 className="text-2xl font-bold text-slate-900">Hey, {user?.name}</h1>
            <p className="text-slate-500 text-sm font-mono mt-1">
              {pendingCount === 0 ? 'All caught up.' : `${pendingCount} task${pendingCount === 1 ? '' : 's'} to go`}
            </p>
          </div>
          <button
            onClick={logout}
            className="border border-slate-300 text-slate-700 text-sm rounded-lg px-4 py-2
                       hover:border-indigo-500 hover:text-indigo-600 transition-colors"
          >
            Log out
          </button>
        </header>

        <TaskForm onCreate={handleCreate} />

        {loading && <p className="text-slate-500 text-sm">Loading tasks…</p>}
        {error && <p className="text-red-600 text-sm">{error}</p>}
        {!loading && !error && tasks.length === 0 && (
          <p className="text-slate-500 text-sm">No tasks yet — add your first one above.</p>
        )}

        <ul className="flex flex-col gap-2.5">
          {tasks.map((task) => (
            <TaskItem key={task.id} task={task} onUpdate={handleUpdate} onDelete={handleDelete} />
          ))}
        </ul>
      </div>
    </div>
  );
}