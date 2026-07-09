import { useState } from 'react';

const borderStyles = {
  pending: 'border-l-ink-secondary/60',
  in_progress: 'border-l-gold',
  completed: 'border-l-moss',
};

const selectStyles = {
  pending: 'border-border bg-paper text-ink',
  in_progress: 'border-gold-border bg-gold-bg text-gold',
  completed: 'border-moss-border bg-moss-bg text-moss',
};

export default function TaskItem({ task, onUpdate, onDelete }) {
  const [updating, setUpdating] = useState(false);

  async function handleStatusChange(e) {
    setUpdating(true);
    try {
      await onUpdate(task.id, { ...task, status: e.target.value });
    } finally {
      setUpdating(false);
    }
  }

  return (
    <li
      className={`bg-paper-raised border border-border border-l-2 border-dashed ${borderStyles[task.status]}
                  rounded px-4 py-3 flex flex-col gap-2 ${task.status === 'completed' ? 'opacity-70' : ''}`}
    >
      <div className="flex items-start justify-between gap-3">
        <p className={`font-medium text-sm text-ink ${task.status === 'completed' ? 'line-through text-ink-secondary' : ''}`}>
          {task.title}
        </p>
        <button
          onClick={() => onDelete(task.id)}
          className="shrink-0 font-mono text-xs uppercase text-white bg-red-500 border border-red-500  rounded px-2 py-1
                     cursor-pointer hover:bg-red-600 hover:text-white hover:border-red-600 transition-colors"
        >
          Delete
        </button>
      </div>

      {task.description && (
        <p className="text-sm text-ink-secondary">{task.description}</p>
      )}

      <div className="flex items-center justify-between gap-3 mt-1">
        <p className="font-mono text-xs text-ink-secondary">
          {task.due_date ? `Due ${new Date(task.due_date).toLocaleDateString()}` : '—'}
        </p>

        <select
          value={task.status}
          onChange={handleStatusChange}
          disabled={updating}
          className={`font-mono text-xs uppercase tracking-wide rounded border
                      px-2 py-1.5 cursor-pointer disabled:opacity-50
                      focus:outline-none focus:ring-2 focus:ring-moss ${selectStyles[task.status]}`}
        >
          <option value="pending">Pending</option>
          <option value="in_progress">In progress</option>
          <option value="completed">Completed</option>
        </select>
      </div>
    </li>
  );
}