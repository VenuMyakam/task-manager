import { useState, useRef, useEffect } from 'react';

export default function TaskForm({ onCreate }) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [dueDate, setDueDate] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const titleRef = useRef(null);

  useEffect(() => {
    titleRef.current?.focus();
  }, []);

  async function handleSubmit(e) {
    e.preventDefault();
    if (!title.trim()) return;

    setSubmitting(true);
    try {
      await onCreate({ title, description, due_date: dueDate || null });
      setTitle('');
      setDescription('');
      setDueDate('');
      titleRef.current?.focus();
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="bg-paper-raised border border-border rounded-md p-4 mb-6 flex flex-col gap-2">
      <div className="grid grid-cols-1 sm:grid-cols-[1fr_auto_auto] gap-2">
        <input
          ref={titleRef}
          placeholder="Add a new task…"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
          className="border border-border rounded-md px-3 py-2 text-sm bg-paper text-ink
                     focus:outline-none focus:ring-2 focus:ring-moss focus:border-moss"
        />
        <input
          type="date"
          value={dueDate}
          onChange={(e) => setDueDate(e.target.value)}
          className="border border-border rounded-md px-3 py-2 text-sm bg-paper text-ink w-full
                     focus:outline-none focus:ring-2 focus:ring-moss focus:border-moss"
        />
      </div>

      <textarea
        placeholder="Description (optional)"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        rows={2}
        className="border border-border rounded-md px-3 py-2 text-sm bg-paper text-ink resize-none
                   focus:outline-none focus:ring-2 focus:ring-moss focus:border-moss"
      />
      <button
          type="submit"
          disabled={submitting || !title.trim()}
          className={`font-medium text-sm rounded-md px-4 py-2 whitespace-nowrap transition-all cursor-pointer
            ${title.trim()
              ? 'bg-gold hover:bg-gold/90 text-[#1a1006] active:scale-95'
              : 'bg-paper border border-border text-ink-secondary cursor-not-allowed'}`}
        >
          {submitting ? 'Adding…' : 'Add task'}
        </button>
    </form>
  );
}