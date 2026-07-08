import { useState } from 'react';

// A "controlled" form — React state is the source of truth for every
// field. onCreate is passed down from the Dashboard, which owns the
// actual task list (state lives as high up as it needs to, no higher).
export default function TaskForm({ onCreate }) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [dueDate, setDueDate] = useState('');
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    if (!title.trim()) return;

    setSubmitting(true);
    try {
      await onCreate({ title, description, due_date: dueDate || null });
      setTitle('');
      setDescription('');
      setDueDate('');
    } finally {
      setSubmitting(false);
    }
  }

return (
    <form
      onSubmit={handleSubmit}
      className="grid grid-cols-1 sm:grid-cols-[1.4fr_1fr_auto_auto] gap-2 mb-8"
    >
      <input
        placeholder="Add a new task…"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        required
        className="border border-slate-300 rounded-lg px-3 py-2 text-sm bg-white
                   focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
      />
      <input
        placeholder="Description (optional)"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        className="border border-slate-300 rounded-lg px-3 py-2 text-sm bg-white
                   focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
      />
      <input
        type="date"
        value={dueDate}
        onChange={(e) => setDueDate(e.target.value)}
        className="border border-slate-300 rounded-lg px-3 py-2 text-sm bg-white
                   focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
      />
      <button
        type="submit"
        disabled={submitting}
        className="bg-amber-500 hover:bg-amber-600 disabled:opacity-60
                   text-white font-semibold text-sm rounded-lg px-4 py-2 whitespace-nowrap transition-colors"
      >
        {submitting ? 'Adding…' : 'Add task'}
      </button>
    </form>
  );
}