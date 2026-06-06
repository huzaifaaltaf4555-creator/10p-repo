import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import PageHeader from '../components/PageHeader'
import TaskTable from '../components/TaskTable'
import Pagination from '../components/Pagination'
import LoadingSpinner from '../components/LoadingSpinner'
import { useToast } from '../context/ToastContext'
import * as taskService from '../services/taskService'

function Tasks() {
  const { showToast } = useToast()
  const [tasks, setTasks] = useState([])
  const [loading, setLoading] = useState(true)
  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState('')
  const [priorityFilter, setPriorityFilter] = useState('')

  const pageSize = 10

  // Fetch tasks whenever filters or page change
  const fetchTasks = async () => {
    setLoading(true)
    try {
      const params = { page, pageSize }
      if (search) params.search = search
      if (statusFilter) params.status = statusFilter
      if (priorityFilter) params.priority = priorityFilter

      const result = await taskService.getTasks(params)
      if (result.success) {
        setTasks(result.data.items)
        setTotalPages(result.data.totalPages)
      }
    } catch (err) {
      console.error('Failed to fetch tasks:', err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchTasks()
  }, [page, statusFilter, priorityFilter])

  // Handle search on Enter key or button click
  const handleSearch = (e) => {
    e.preventDefault()
    setPage(1)
    fetchTasks()
  }

  // Handle task deletion
  const handleDelete = async (taskId) => {
    if (!window.confirm('Are you sure you want to delete this task?')) return

    try {
      const result = await taskService.deleteTask(taskId)
      if (result.success) {
        showToast('Task deleted successfully.', 'success')
        fetchTasks()
      }
    } catch (err) {
      showToast('Failed to delete task.', 'error')
    }
  }

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="Tasks"
        title="Task list"
        subtitle="Review tasks assigned to your team. Filter by status or priority."
        actions={
          <Link
            to="/tasks/new"
            className="rounded-md bg-slate-900 px-4 py-2 text-sm font-semibold text-white transition hover:bg-slate-800"
          >
            New task
          </Link>
        }
      />

      {/* Search and Filters */}
      <div className="flex flex-col gap-3 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm md:flex-row md:items-center">
        <form onSubmit={handleSearch} className="flex flex-1 gap-2">
          <input
            type="text"
            placeholder="Search tasks..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="h-10 flex-1 rounded-md border border-slate-200 bg-white px-3 text-sm text-slate-900 outline-none transition focus:border-slate-400"
          />
          <button
            type="submit"
            className="h-10 rounded-md bg-slate-900 px-4 text-sm font-semibold text-white transition hover:bg-slate-800"
          >
            Search
          </button>
        </form>
        <select
          value={statusFilter}
          onChange={(e) => { setStatusFilter(e.target.value); setPage(1) }}
          className="h-10 rounded-md border border-slate-200 bg-white px-3 text-sm text-slate-900 outline-none"
        >
          <option value="">All statuses</option>
          <option value="Pending">Pending</option>
          <option value="InProgress">In Progress</option>
          <option value="Completed">Completed</option>
        </select>
        <select
          value={priorityFilter}
          onChange={(e) => { setPriorityFilter(e.target.value); setPage(1) }}
          className="h-10 rounded-md border border-slate-200 bg-white px-3 text-sm text-slate-900 outline-none"
        >
          <option value="">All priorities</option>
          <option value="Low">Low</option>
          <option value="Medium">Medium</option>
          <option value="High">High</option>
        </select>
      </div>

      {/* Task Table */}
      {loading ? (
        <LoadingSpinner message="Loading tasks..." />
      ) : tasks.length === 0 ? (
        <div className="rounded-2xl border border-slate-200 bg-white p-8 text-center shadow-sm">
          <p className="text-sm text-slate-500">No tasks found.</p>
          <Link
            to="/tasks/new"
            className="mt-4 inline-flex rounded-md bg-slate-900 px-4 py-2 text-sm font-semibold text-white transition hover:bg-slate-800"
          >
            Create your first task
          </Link>
        </div>
      ) : (
        <>
          <TaskTable tasks={tasks} onDelete={handleDelete} />
          <Pagination page={page} totalPages={totalPages} onPageChange={setPage} />
        </>
      )}
    </div>
  )
}

export default Tasks
