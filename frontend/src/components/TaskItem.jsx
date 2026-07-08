const STATUS_LABELS = {
  pending: 'Pending',
  in_progress: 'In progress',
  completed: 'Completed',
};

const NEXT_STATUS = {
  pending: 'in_progress',
  in_progress: 'completed',
  completed: 'pending',
};

export default function TaskItem({ task, onUpdate, onDelete }) {
  function cycleStatus() {
    onUpdate(task.id, { ...task, status: NEXT_STATUS[task.status] });
  }

const statusStyles = {
    pending: 'bg-slate-100 text-slate-600',
    in_progress: 'bg-amber-100 text-amber-700',
    completed: 'bg-emerald-100 text-emerald-700',
  };

  const borderStyles = {
    pending: 'border-l-slate-300',
    in_progress: 'border-l-amber-400',
    completed: 'border-l-emerald-500',
  };

  return (
    <li
      className={`flex items-start gap-4 bg-white border border-slate-200 border-l-4 ${borderStyles[task.status]}
                  rounded-lg px-4 py-3 ${task.status === 'completed' ? 'opacity-70' : ''}`}
    >
      <button
        onClick={cycleStatus}
        title="Click to change status"
        className={`shrink-0 text-xs font-mono uppercase tracking-wide rounded-md px-2.5 py-1 ${statusStyles[task.status]}`}
      >
        {STATUS_LABELS[task.status]}
      </button>

      <div className="flex-1 min-w-0">
        <p className={`font-semibold text-sm text-slate-900 ${task.status === 'completed' ? 'line-through text-slate-400' : ''}`}>
          {task.title}
        </p>
        {task.description && (
          <p className="text-sm text-slate-500 mt-0.5">{task.description}</p>
        )}
        {task.due_date && (
          <p className="text-xs font-mono text-slate-400 mt-1">
            Due {new Date(task.due_date).toLocaleDateString()}
          </p>
        )}
      </div>

      <button
        onClick={() => onDelete(task.id)}
        className="shrink-0 text-xs text-slate-400 hover:text-red-600 transition-colors"
      >
        Delete
      </button>
    </li>
  );
}