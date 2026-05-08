import PageHeader from '../components/PageHeader'

function TaskForm() {
  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="New task"
        title="Create a task"
        subtitle="Fill in the details below to assign a new task."
        actions={
          <button className="rounded-md border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-600 transition hover:bg-slate-100">
            Save draft
          </button>
        }
      />

      <form className="grid gap-6 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm md:grid-cols-2">
        <label className="grid gap-2 text-sm text-slate-700 md:col-span-2">
          Task title
          <input
            type="text"
            placeholder="Add a clear task title"
            className="h-11 rounded-md border border-slate-200 bg-white px-3 text-sm text-slate-900 outline-none transition focus:border-slate-400"
          />
        </label>

        <label className="grid gap-2 text-sm text-slate-700 md:col-span-2">
          Description
          <textarea
            rows="4"
            placeholder="Describe the work that needs to be done"
            className="rounded-md border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 outline-none transition focus:border-slate-400"
          />
        </label>

        <label className="grid gap-2 text-sm text-slate-700">
          Status
          <select className="h-11 rounded-md border border-slate-200 bg-white px-3 text-sm text-slate-900 outline-none transition focus:border-slate-400">
            <option>Pending</option>
            <option>In progress</option>
            <option>Completed</option>
          </select>
        </label>

        <label className="grid gap-2 text-sm text-slate-700">
          Priority
          <select className="h-11 rounded-md border border-slate-200 bg-white px-3 text-sm text-slate-900 outline-none transition focus:border-slate-400">
            <option>Low</option>
            <option>Medium</option>
            <option>High</option>
          </select>
        </label>

        <label className="grid gap-2 text-sm text-slate-700">
          Due date
          <input
            type="date"
            className="h-11 rounded-md border border-slate-200 bg-white px-3 text-sm text-slate-900 outline-none transition focus:border-slate-400"
          />
        </label>

        <label className="grid gap-2 text-sm text-slate-700">
          Assign to
          <input
            type="text"
            placeholder="Search by name"
            className="h-11 rounded-md border border-slate-200 bg-white px-3 text-sm text-slate-900 outline-none transition focus:border-slate-400"
          />
        </label>

        <label className="grid gap-2 text-sm text-slate-700">
          Category
          <input
            type="text"
            placeholder="UX, QA, Security"
            className="h-11 rounded-md border border-slate-200 bg-white px-3 text-sm text-slate-900 outline-none transition focus:border-slate-400"
          />
        </label>

        <div className="flex flex-wrap gap-3 md:col-span-2">
          <button
            type="submit"
            className="rounded-md bg-slate-900 px-4 py-2 text-sm font-semibold text-white transition hover:bg-slate-800"
          >
            Create task
          </button>
          <button
            type="button"
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
