import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import PageHeader from '../components/PageHeader'
import StatCard from '../components/StatCard'
import StatusBadge from '../components/StatusBadge'
import LoadingSpinner from '../components/LoadingSpinner'
import * as taskService from '../services/taskService'

function Dashboard() {
  const { user } = useAuth()
  const [stats, setStats] = useState({ completed: 0, inProgress: 0, pending: 0 })
  const [tasks, setTasks] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [statsResult, tasksResult] = await Promise.all([
          taskService.getTaskStats(),
          taskService.getTasks({ page: 1, pageSize: 5 }),
        ])

        if (statsResult.success) setStats(statsResult.data)
        if (tasksResult.success) setTasks(tasksResult.data.items)
      } catch (err) {
        console.error('Failed to load dashboard data:', err)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  if (loading) return <LoadingSpinner message="Loading dashboard..." />

  const statCards = [
    { label: 'Completed', value: stats.completed, accent: 'text-emerald-600' },
    { label: 'In progress', value: stats.inProgress, accent: 'text-blue-600' },
    { label: 'Pending', value: stats.pending, accent: 'text-amber-600' },
  ]

  const firstName = user?.fullName?.split(' ')[0] || 'there'

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="Dashboard"
        title={`Welcome back, ${firstName}`}
        subtitle="Here is a snapshot of your task progress this week."
        actions={
          <Link
            to="/tasks/new"
            className="rounded-md bg-slate-900 px-4 py-2 text-sm font-semibold text-white transition hover:bg-slate-800"
          >
            New task
          </Link>
        }
      />

      <section className="grid gap-4 md:grid-cols-3">
        {statCards.map((item) => (
          <StatCard key={item.label} {...item} />
        ))}
      </section>

      <section className="rounded-2xl border border-slate-200 bg-white shadow-sm">
        <div className="flex flex-col gap-3 border-b border-slate-200 px-6 py-5 md:flex-row md:items-center md:justify-between">
          <div>
            <h2 className="text-lg font-semibold text-slate-900">Recent tasks</h2>
            <p className="mt-1 text-sm text-slate-600">
              Latest tasks that need attention.
            </p>
          </div>
          <Link
            to="/tasks"
            className="text-sm font-semibold text-slate-600 transition hover:text-slate-900"
          >
            View all →
          </Link>
        </div>

        <div className="divide-y divide-slate-200">
          {tasks.length === 0 ? (
            <div className="px-6 py-8 text-center text-sm text-slate-500">
              No tasks yet. Create your first task!
            </div>
          ) : (
            tasks.map((task) => (
              <div
                key={task.id}
                className="flex flex-col gap-3 px-6 py-4 md:flex-row md:items-center md:justify-between"
              >
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.15em] text-slate-400">
                    #{task.id}
                  </p>
                  <p className="mt-1 text-base font-semibold text-slate-900">
                    {task.title}
                  </p>
                  <p className="mt-1 text-sm text-slate-600">
                    Assigned to {task.assignedUserName || 'Unassigned'}
                  </p>
                </div>
                <div className="flex flex-wrap items-center gap-3 text-xs text-slate-500">
                  <StatusBadge status={task.status} />
                  <span className="rounded-full border border-slate-200 px-3 py-1">
                    Priority: {task.priority}
                  </span>
                </div>
                <Link
                  to={`/tasks/${task.id}`}
                  className="text-sm font-semibold text-slate-700 transition hover:text-slate-900"
                >
                  View details
                </Link>
              </div>
            ))
          )}
        </div>
      </section>
    </div>
  )
}

export default Dashboard
