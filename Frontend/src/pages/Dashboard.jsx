import { Link } from 'react-router-dom'
import PageHeader from '../components/PageHeader'
import StatCard from '../components/StatCard'
import StatusBadge from '../components/StatusBadge'
import { mockStats, mockTasks, mockUser } from '../data/mockData'

function Dashboard() {
  const stats = [
    { label: 'Completed', value: mockStats.completed, accent: 'text-emerald-600' },
    {
      label: 'In progress',
      value: mockStats.inProgress,
      accent: 'text-blue-600',
    },
    { label: 'Pending', value: mockStats.pending, accent: 'text-amber-600' },
  ]

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="Dashboard"
        title={`Welcome back, ${mockUser.name.split(' ')[0]}`}
        subtitle="Here is a snapshot of your task progress this week."
        actions={
          <>
            <button className="rounded-md border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-600 transition hover:bg-slate-100">
              Export
            </button>
            <button className="rounded-md bg-slate-900 px-4 py-2 text-sm font-semibold text-white transition hover:bg-slate-800">
              New task
            </button>
          </>
        }
      />

      <section className="grid gap-4 md:grid-cols-3">
        {stats.map((item) => (
          <StatCard key={item.label} {...item} />
        ))}
      </section>

      <section className="rounded-2xl border border-slate-200 bg-white shadow-sm">
        <div className="flex flex-col gap-3 border-b border-slate-200 px-6 py-5 md:flex-row md:items-center md:justify-between">
          <div>
            <h2 className="text-lg font-semibold text-slate-900">Active tasks</h2>
            <p className="mt-1 text-sm text-slate-600">
              Track the tasks that need attention today.
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            <button className="rounded-md border border-slate-200 px-3 py-2 text-xs font-semibold text-slate-600 transition hover:bg-slate-100">
              All
            </button>
            <button className="rounded-md border border-slate-200 px-3 py-2 text-xs font-semibold text-slate-600 transition hover:bg-slate-100">
              In progress
            </button>
            <button className="rounded-md border border-slate-200 px-3 py-2 text-xs font-semibold text-slate-600 transition hover:bg-slate-100">
              Pending
            </button>
            <button className="rounded-md border border-slate-200 px-3 py-2 text-xs font-semibold text-slate-600 transition hover:bg-slate-100">
              Completed
            </button>
          </div>
        </div>

        <div className="divide-y divide-slate-200">
          {mockTasks.map((task) => (
            <div
              key={task.id}
              className="flex flex-col gap-3 px-6 py-4 md:flex-row md:items-center md:justify-between"
            >
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.15em] text-slate-400">
                  {task.id}
                </p>
                <p className="mt-1 text-base font-semibold text-slate-900">
                  {task.title}
                </p>
                <p className="mt-1 text-sm text-slate-600">
                  Assigned to {task.assignee}
                </p>
              </div>
              <div className="flex flex-wrap items-center gap-3 text-xs text-slate-500">
                <StatusBadge status={task.status} />
                <span className="rounded-full border border-slate-200 px-3 py-1">
                  Priority: {task.priority}
                </span>
                <span className="rounded-full border border-slate-200 px-3 py-1">
                  Due {task.dueDate}
                </span>
              </div>
              <Link
                to={`/tasks/${task.id}`}
                className="text-sm font-semibold text-slate-700 transition hover:text-slate-900"
              >
                View details
              </Link>
            </div>
          ))}
        </div>
      </section>
    </div>
  )
}

export default Dashboard
