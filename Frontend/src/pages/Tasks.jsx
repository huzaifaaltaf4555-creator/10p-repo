import PageHeader from '../components/PageHeader'
import TaskTable from '../components/TaskTable'
import { mockTasks } from '../data/mockData'

function Tasks() {
  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="Tasks"
        title="Task list"
        subtitle="Review tasks assigned to your team. Filter by status or priority."
        actions={
          <>
            <button className="rounded-md border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-600 transition hover:bg-slate-100">
              Filter
            </button>
            <button className="rounded-md bg-slate-900 px-4 py-2 text-sm font-semibold text-white transition hover:bg-slate-800">
              New task
            </button>
          </>
        }
      />

      <div className="grid gap-4 md:grid-cols-[1fr_280px]">
        <TaskTable tasks={mockTasks} />
        <aside className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <h3 className="text-sm font-semibold text-slate-900">Quick filters</h3>
          <div className="mt-4 space-y-3 text-sm text-slate-600">
            <label className="flex items-center gap-2">
              <input type="checkbox" className="h-4 w-4 accent-slate-900" />
              Show my tasks only
            </label>
            <label className="flex items-center gap-2">
              <input type="checkbox" className="h-4 w-4 accent-slate-900" />
              Due this week
            </label>
            <label className="flex items-center gap-2">
              <input type="checkbox" className="h-4 w-4 accent-slate-900" />
              High priority
            </label>
          </div>
          <div className="mt-6 rounded-lg border border-slate-200 bg-slate-50 p-4 text-xs text-slate-500">
            <p className="font-semibold text-slate-700">Tip</p>
            <p className="mt-2">Use filters to narrow tasks before exporting.</p>
          </div>
        </aside>
      </div>
    </div>
  )
}

export default Tasks
