import { Link } from 'react-router-dom'
import StatusBadge from './StatusBadge'
import { formatDate } from '../services/formatters'

function TaskTable({ tasks, onDelete }) {
  return (
    <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
      {/* Table header — hidden on small screens */}
      <div className="hidden grid-cols-12 gap-2 border-b border-slate-200 px-6 py-4 text-xs font-semibold uppercase tracking-[0.15em] text-slate-500 md:grid">
        <span className="col-span-3">Task</span>
        <span className="col-span-2">Status</span>
        <span className="col-span-2">Priority</span>
        <span className="col-span-2">Due</span>
        <span className="col-span-1">Assignee</span>
        <span className="col-span-2 text-right">Actions</span>
      </div>
      <div className="divide-y divide-slate-200">
        {tasks.map((task) => (
          <div
            key={task.id}
            className="flex flex-col gap-3 px-6 py-4 md:grid md:grid-cols-12 md:items-center md:gap-2"
          >
            <div className="col-span-3">
              <p className="text-xs font-semibold uppercase tracking-[0.1em] text-slate-400">
                #{task.id}
              </p>
              <p className="mt-1 font-semibold text-slate-900">{task.title}</p>
            </div>
            <div className="col-span-2">
              <StatusBadge status={task.status} />
            </div>
            <div className="col-span-2 text-sm text-slate-700">{task.priority}</div>
            <div className="col-span-2 text-sm text-slate-700">{formatDate(task.dueDate)}</div>
            <div className="col-span-1 text-sm text-slate-700">
              {task.assignedUserName || '—'}
            </div>
            <div className="col-span-2 flex items-center justify-end gap-2">
              <Link
                to={`/tasks/${task.id}`}
                className="text-xs font-semibold text-slate-600 transition hover:text-slate-900"
              >
                View
              </Link>
              <Link
                to={`/tasks/${task.id}/edit`}
                className="text-xs font-semibold text-blue-600 transition hover:text-blue-800"
              >
                Edit
              </Link>
              {onDelete && (
                <button
                  onClick={() => onDelete(task.id)}
                  className="text-xs font-semibold text-red-600 transition hover:text-red-800"
                >
                  Delete
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default TaskTable
