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
  const [filter, setFilter] = useState('all'); // 'all' | 'pending' | 'in_progress' | 'completed'
  const [search, setSearch] = useState('');

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
      cancelled = true;
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
  const filteredTasks = tasks
  .filter((t) => filter === 'all' || t.status === filter)
  .filter((t) => t.title.toLowerCase().includes(search.trim().toLowerCase()));

  const filterStyles = {
    all: 'bg-ink text-paper border-ink',
    pending: 'bg-paper text-ink border-ink-secondary',
    in_progress: 'bg-gold-bg text-gold border-gold-border',
    completed: 'bg-moss-bg text-moss border-moss-border',
  };

  const filterInactive = 'border-border text-ink-secondary hover:border-ink-secondary hover:text-ink';

  return (
    <div className="min-h-screen bg-paper">
      <div className="max-w-2xl mx-auto px-6 py-12">
        <header className="flex justify-between items-start mb-7">
          <div>
            <h1 className="text-xl font-medium text-ink">Hey, {user?.name}</h1>
            <p className="font-mono text-xs uppercase tracking-wide text-ink-secondary mt-1.5">
              {pendingCount === 0 ? 'All caught up.' : `${pendingCount} task${pendingCount === 1 ? '' : 's'} to go`}
            </p>
          </div>
          <button
            onClick={logout}
            className="border border-border text-ink text-sm rounded-md px-3.5 py-2 cursor-pointer
                       hover:border-moss hover:text-moss transition-colors"
          >
            Log out
          </button>
        </header>

        <TaskForm onCreate={handleCreate} />

        <div className="flex flex-col sm:flex-row sm:items-center gap-3 mb-5">
          <div className="flex flex-wrap gap-2">
            {[
              { key: 'all', label: 'All' },
              { key: 'pending', label: 'Pending' },
              { key: 'in_progress', label: 'In progress' },
              { key: 'completed', label: 'Completed' },
            ].map((opt) => (
              <button
                key={opt.key}
                onClick={() => setFilter(opt.key)}
                className={`font-mono text-xs uppercase tracking-wide rounded px-3 py-1.5 border transition-colors
                  ${filter === opt.key ? filterStyles[opt.key] : filterInactive}`}
              >
                {opt.label}
              </button>
            ))}
          </div>

          <input
            type="text"
            placeholder="Search tasks…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full sm:w-48 sm:ml-auto border border-border rounded px-3 py-1.5 text-sm bg-paper-raised text-ink
                      focus:outline-none focus:ring-2 focus:ring-moss focus:border-moss"
          />
        </div>

        {loading && <p className="text-ink-secondary text-sm">Loading tasks…</p>}
        {error && <p className="text-rust text-sm">{error}</p>}
        {!loading && !error && filteredTasks.length === 0 && (
          <p className="text-ink-secondary text-sm">
            {tasks.length === 0
              ? 'No tasks yet — add your first one above.'
              : 'No tasks match your filters.'}
          </p>
        )}

        <ul className="flex flex-col gap-2.5">
          {filteredTasks.map((task) => (
            <TaskItem key={task.id} task={task} onUpdate={handleUpdate} onDelete={handleDelete} />
          ))}
        </ul>
      </div>
    </div>
  );
}