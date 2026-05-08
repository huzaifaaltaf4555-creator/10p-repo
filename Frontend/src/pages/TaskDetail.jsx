import { useParams } from 'react-router-dom'
import PageHeader from '../components/PageHeader'
import StatusBadge from '../components/StatusBadge'
import { mockTasks } from '../data/mockData'

function TaskDetail() {
  const { taskId } = useParams()
  const task = mockTasks.find((item) => item.id === taskId) || mockTasks[0]

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="Task detail"
        title={task.title}
        subtitle="View task description, status, and assigned team member."
        actions={
          <button className="rounded-md bg-slate-900 px-4 py-2 text-sm font-semibold text-white transition hover:bg-slate-800">
            Edit task
          </button>
        }
      />

      <div className="grid gap-6 md:grid-cols-[1.2fr_0.8fr]">
        <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <h3 className="text-sm font-semibold text-slate-900">Summary</h3>
          <p className="mt-3 text-sm text-slate-600">{task.description}</p>
          <div className="mt-6 grid gap-4 text-sm text-slate-700 sm:grid-cols-2">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.15em] text-slate-400">
                Task ID
              </p>
              <p className="mt-1 font-semibold text-slate-900">{task.id}</p>
            </div>
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.15em] text-slate-400">
                Category
              </p>
              <p className="mt-1 font-semibold text-slate-900">{task.category}</p>
            </div>
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.15em] text-slate-400">
                Due date
              </p>
              <p className="mt-1 font-semibold text-slate-900">{task.dueDate}</p>
            </div>
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.15em] text-slate-400">
                Priority
              </p>
              <p className="mt-1 font-semibold text-slate-900">{task.priority}</p>
            </div>
          </div>
        </section>

        <aside className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <h3 className="text-sm font-semibold text-slate-900">Status</h3>
          <div className="mt-4 flex items-center gap-3">
            <StatusBadge status={task.status} />
            <span className="text-sm text-slate-600">Updated today</span>
          </div>
          <div className="mt-6 text-sm text-slate-700">
            <p className="text-xs font-semibold uppercase tracking-[0.15em] text-slate-400">
              Assignee
            </p>
            <p className="mt-2 font-semibold text-slate-900">{task.assignee}</p>
          </div>
          <div className="mt-6 rounded-lg border border-slate-200 bg-slate-50 p-4 text-xs text-slate-500">
            <p className="font-semibold text-slate-700">Reminder</p>
            <p className="mt-2">
              Notify the assignee when the task status is updated.
            </p>
          </div>
        </aside>
      </div>
    </div>
  )
}

export default TaskDetail
