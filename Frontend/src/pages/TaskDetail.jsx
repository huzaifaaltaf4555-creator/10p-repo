import { useEffect, useState } from 'react'
import { useParams, Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { useToast } from '../context/ToastContext'
import PageHeader from '../components/PageHeader'
import StatusBadge from '../components/StatusBadge'
import LoadingSpinner from '../components/LoadingSpinner'
import { formatDate } from '../services/formatters'
import * as taskService from '../services/taskService'

function TaskDetail() {
  const { taskId } = useParams()
  const navigate = useNavigate()
  const { isAdmin } = useAuth()
  const { showToast } = useToast()

  const [task, setTask] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchTask = async () => {
      try {
        const result = await taskService.getTaskById(taskId)
        if (result.success) {
          setTask(result.data)
        }
      } catch (err) {
        console.error('Failed to fetch task:', err)
        showToast('Task not found.', 'error')
        navigate('/tasks')
      } finally {
        setLoading(false)
      }
    }

    fetchTask()
  }, [taskId])

  const handleDelete = async () => {
    if (!window.confirm('Are you sure you want to delete this task?')) return

    try {
      const result = await taskService.deleteTask(taskId)
      if (result.success) {
        showToast('Task deleted successfully.', 'success')
        navigate('/tasks')
      }
    } catch (err) {
      showToast('Failed to delete task.', 'error')
    }
  }

  if (loading) return <LoadingSpinner message="Loading task..." />
  if (!task) return null

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="Task detail"
        title={task.title}
        subtitle="View task description, status, and assigned team member."
        actions={
          <div className="flex gap-2">
            <Link
              to={`/tasks/${task.id}/edit`}
              className="rounded-md bg-slate-900 px-4 py-2 text-sm font-semibold text-white transition hover:bg-slate-800"
            >
              Edit task
            </Link>
            <button
              onClick={handleDelete}
              className="rounded-md border border-red-200 px-4 py-2 text-sm font-semibold text-red-600 transition hover:bg-red-50"
            >
              Delete
            </button>
          </div>
        }
      />

      <div className="grid gap-6 md:grid-cols-[1.2fr_0.8fr]">
        <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <h3 className="text-sm font-semibold text-slate-900">Summary</h3>
          <p className="mt-3 text-sm text-slate-600">
            {task.description || 'No description provided.'}
          </p>
          <div className="mt-6 grid gap-4 text-sm text-slate-700 sm:grid-cols-2">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.15em] text-slate-400">
                Task ID
              </p>
              <p className="mt-1 font-semibold text-slate-900">#{task.id}</p>
            </div>
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.15em] text-slate-400">
                Category
              </p>
              <p className="mt-1 font-semibold text-slate-900">
                {task.category || 'N/A'}
              </p>
            </div>
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.15em] text-slate-400">
                Due date
              </p>
              <p className="mt-1 font-semibold text-slate-900">
                {formatDate(task.dueDate)}
              </p>
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
            <span className="text-sm text-slate-600">
              Updated {formatDate(task.updatedAt)}
            </span>
          </div>
          <div className="mt-6 text-sm text-slate-700">
            <p className="text-xs font-semibold uppercase tracking-[0.15em] text-slate-400">
              Assignee
            </p>
            <p className="mt-2 font-semibold text-slate-900">
              {task.assignedUserName || 'Unassigned'}
            </p>
          </div>
          <div className="mt-6 text-sm text-slate-700">
            <p className="text-xs font-semibold uppercase tracking-[0.15em] text-slate-400">
              Created
            </p>
            <p className="mt-2 font-semibold text-slate-900">
              {formatDate(task.createdAt)}
            </p>
          </div>
        </aside>
      </div>
    </div>
  )
}

export default TaskDetail
