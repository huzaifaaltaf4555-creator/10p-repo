import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useToast } from '../context/ToastContext'
import PageHeader from '../components/PageHeader'
import LoadingSpinner from '../components/LoadingSpinner'
import * as taskService from '../services/taskService'

function TaskForm() {
  const { taskId } = useParams()
  const navigate = useNavigate()
  const { showToast } = useToast()

  const isEditMode = !!taskId

  const [loading, setLoading] = useState(isEditMode)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')

  // Form state
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [status, setStatus] = useState('0')    // Pending
  const [priority, setPriority] = useState('1') // Medium
  const [category, setCategory] = useState('')
  const [dueDate, setDueDate] = useState('')

  // Load task data in edit mode
  useEffect(() => {
    if (!isEditMode) return

    const fetchTask = async () => {
      try {
        const result = await taskService.getTaskById(taskId)
        if (result.success) {
          const t = result.data
          setTitle(t.title)
          setDescription(t.description || '')
          // Map string status/priority back to enum values
          setStatus(mapStatusToEnum(t.status))
          setPriority(mapPriorityToEnum(t.priority))
          setCategory(t.category || '')
          setDueDate(t.dueDate ? t.dueDate.split('T')[0] : '')
        }
      } catch (err) {
        showToast('Failed to load task.', 'error')
        navigate('/tasks')
      } finally {
        setLoading(false)
      }
    }

    fetchTask()
  }, [taskId])

  const mapStatusToEnum = (str) => {
    const map = { Pending: '0', InProgress: '1', Completed: '2' }
    return map[str] || '0'
  }

  const mapPriorityToEnum = (str) => {
    const map = { Low: '0', Medium: '1', High: '2' }
    return map[str] || '1'
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')

    if (!title.trim()) {
      setError('Task title is required.')
      return
    }

    setSubmitting(true)

    const taskData = {
      title: title.trim(),
      description: description.trim(),
      status: parseInt(status, 10),
      priority: parseInt(priority, 10),
      category: category.trim(),
      dueDate: dueDate || null,
    }

    try {
      let result
      if (isEditMode) {
        result = await taskService.updateTask(taskId, taskData)
      } else {
        result = await taskService.createTask(taskData)
      }

      if (result.success) {
        showToast(
          isEditMode ? 'Task updated successfully.' : 'Task created successfully.',
          'success'
        )
        navigate('/tasks')
      } else {
        setError(result.message || 'Operation failed.')
      }
    } catch (err) {
      const msg = err.response?.data?.message || 'Something went wrong.'
      setError(msg)
    } finally {
      setSubmitting(false)
    }
  }

  if (loading) return <LoadingSpinner message="Loading task..." />

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow={isEditMode ? 'Edit task' : 'New task'}
        title={isEditMode ? 'Update task' : 'Create a task'}
        subtitle={
          isEditMode
            ? 'Modify the task details below.'
            : 'Fill in the details below to assign a new task.'
        }
      />

      {error && (
        <div className="rounded-md border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </div>
      )}

      <form
        onSubmit={handleSubmit}
        className="grid gap-6 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm md:grid-cols-2"
      >
        <label className="grid gap-2 text-sm text-slate-700 md:col-span-2">
          Task title *
          <input
            type="text"
            placeholder="Add a clear task title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="h-11 rounded-md border border-slate-200 bg-white px-3 text-sm text-slate-900 outline-none transition focus:border-slate-400"
          />
        </label>

        <label className="grid gap-2 text-sm text-slate-700 md:col-span-2">
          Description
          <textarea
            rows="4"
            placeholder="Describe the work that needs to be done"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="rounded-md border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 outline-none transition focus:border-slate-400"
          />
        </label>

        <label className="grid gap-2 text-sm text-slate-700">
          Status
          <select
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            className="h-11 rounded-md border border-slate-200 bg-white px-3 text-sm text-slate-900 outline-none transition focus:border-slate-400"
          >
            <option value="0">Pending</option>
            <option value="1">In progress</option>
            <option value="2">Completed</option>
          </select>
        </label>

        <label className="grid gap-2 text-sm text-slate-700">
          Priority
          <select
            value={priority}
            onChange={(e) => setPriority(e.target.value)}
            className="h-11 rounded-md border border-slate-200 bg-white px-3 text-sm text-slate-900 outline-none transition focus:border-slate-400"
          >
            <option value="0">Low</option>
            <option value="1">Medium</option>
            <option value="2">High</option>
          </select>
        </label>

        <label className="grid gap-2 text-sm text-slate-700">
          Due date
          <input
            type="date"
            value={dueDate}
            onChange={(e) => setDueDate(e.target.value)}
            className="h-11 rounded-md border border-slate-200 bg-white px-3 text-sm text-slate-900 outline-none transition focus:border-slate-400"
          />
        </label>

        <label className="grid gap-2 text-sm text-slate-700">
          Category
          <input
            type="text"
            placeholder="UX, QA, Security"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="h-11 rounded-md border border-slate-200 bg-white px-3 text-sm text-slate-900 outline-none transition focus:border-slate-400"
          />
        </label>

        <div className="flex flex-wrap gap-3 md:col-span-2">
          <button
            type="submit"
            disabled={submitting}
            className="rounded-md bg-slate-900 px-4 py-2 text-sm font-semibold text-white transition hover:bg-slate-800 disabled:opacity-60"
          >
            {submitting
              ? isEditMode ? 'Updating...' : 'Creating...'
              : isEditMode ? 'Update task' : 'Create task'}
          </button>
          <button
            type="button"
            onClick={() => navigate('/tasks')}
            className="rounded-md border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-600 transition hover:bg-slate-100"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  )
}

export default TaskForm
