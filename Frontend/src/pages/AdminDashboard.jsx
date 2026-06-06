import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { useToast } from '../context/ToastContext'
import PageHeader from '../components/PageHeader'
import StatCard from '../components/StatCard'
import TaskTable from '../components/TaskTable'
import Pagination from '../components/Pagination'
import LoadingSpinner from '../components/LoadingSpinner'
import * as taskService from '../services/taskService'

/**
 * Admin Dashboard — shows all users' tasks with aggregate stats.
 * Only accessible by admin role.
 */
function AdminDashboard() {
  const { showToast } = useToast()

  const [stats, setStats] = useState({ completed: 0, inProgress: 0, pending: 0 })
  const [tasks, setTasks] = useState([])
  const [loading, setLoading] = useState(true)
  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)

  const fetchData = async () => {
    setLoading(true)
    try {
      const [statsResult, tasksResult] = await Promise.all([
        taskService.getTaskStats(),
        taskService.getTasks({ page, pageSize: 10 }),
      ])

      if (statsResult.success) setStats(statsResult.data)
      if (tasksResult.success) {
        setTasks(tasksResult.data.items)
        setTotalPages(tasksResult.data.totalPages)
      }
    } catch (err) {
      console.error('Failed to load admin data:', err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchData()
  }, [page])

  const handleDelete = async (taskId) => {
    if (!window.confirm('Delete this task?')) return
    try {
      await taskService.deleteTask(taskId)
      showToast('Task deleted.', 'success')
      fetchData()
    } catch (err) {
      showToast('Failed to delete task.', 'error')
    }
  }

  if (loading) return <LoadingSpinner message="Loading admin dashboard..." />

  const total = stats.completed + stats.inProgress + stats.pending

  const statCards = [
    { label: 'Total Tasks', value: total, accent: 'text-slate-900' },
    { label: 'Completed', value: stats.completed, accent: 'text-emerald-600' },
    { label: 'In Progress', value: stats.inProgress, accent: 'text-blue-600' },
    { label: 'Pending', value: stats.pending, accent: 'text-amber-600' },
  ]

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="Admin"
        title="Admin Dashboard"
        subtitle="Overview of all tasks across the system."
        actions={
          <Link
            to="/tasks/new"
            className="rounded-md bg-slate-900 px-4 py-2 text-sm font-semibold text-white transition hover:bg-slate-800"
          >
            New task
          </Link>
        }
      />

      <section className="grid gap-4 sm:grid-cols-2 md:grid-cols-4">
        {statCards.map((item) => (
          <StatCard key={item.label} {...item} />
        ))}
      </section>

      <section>
        <h2 className="mb-4 text-lg font-semibold text-slate-900">All Tasks</h2>
        {tasks.length === 0 ? (
          <div className="rounded-2xl border border-slate-200 bg-white p-8 text-center shadow-sm">
            <p className="text-sm text-slate-500">No tasks in the system.</p>
          </div>
        ) : (
          <>
            <TaskTable tasks={tasks} onDelete={handleDelete} />
            <Pagination page={page} totalPages={totalPages} onPageChange={setPage} />
          </>
        )}
      </section>
    </div>
  )
}

export default AdminDashboard
