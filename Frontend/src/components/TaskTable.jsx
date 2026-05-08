import { Link } from 'react-router-dom'
import StatusBadge from './StatusBadge'
import { formatDate } from '../services/formatters'

function TaskTable({ tasks }) {
  return (
    <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
      <div className="grid grid-cols-12 gap-2 border-b border-slate-200 px-6 py-4 text-xs font-semibold uppercase tracking-[0.15em] text-slate-500">
        <span className="col-span-4">Task</span>
        <span className="col-span-2">Status</span>
        <span className="col-span-2">Priority</span>
        <span className="col-span-2">Due</span>
        <span className="col-span-1">Assignee</span>
        <span className="col-span-1 text-right">Action</span>
      </div>
      <div className="divide-y divide-slate-200">
        {tasks.map((task) => (
          <div
            key={task.id}
            className="grid grid-cols-12 items-center gap-2 px-6 py-4 text-sm text-slate-700"
          >
            <div className="col-span-4">
              <p className="text-xs font-semibold uppercase tracking-[0.1em] text-slate-400">
                {task.id}
              </p>
              <p className="mt-1 font-semibold text-slate-900">{task.title}</p>
            </div>
            <div className="col-span-2">
              <StatusBadge status={task.status} />
            </div>
            <div className="col-span-2">{task.priority}</div>
            <div className="col-span-2">{formatDate(task.dueDate)}</div>
            <div className="col-span-1">{task.assignee}</div>
            <div className="col-span-1 text-right">
              <Link
                to={`/tasks/${task.id}`}
                className="text-xs font-semibold text-slate-600 transition hover:text-slate-900"
              >
                View
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default TaskTable
