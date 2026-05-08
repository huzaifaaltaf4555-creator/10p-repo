import { NavLink } from 'react-router-dom'

const links = [
  { to: '/dashboard', label: 'Dashboard' },
  { to: '/tasks', label: 'Task List' },
  { to: '/tasks/new', label: 'New Task' },
  { to: '/profile', label: 'Profile' },
]

function Sidebar() {
  return (
    <aside className="hidden w-60 flex-col gap-4 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm md:flex">
      <div>
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">
          Task Manager
        </p>
        <h2 className="mt-3 text-lg font-semibold text-slate-900">Workspace</h2>
      </div>
      <nav className="flex flex-col gap-2">
        {links.map((link) => (
          <NavLink
            key={link.to}
            to={link.to}
            className={({ isActive }) =>
              `rounded-lg px-3 py-2 text-sm font-medium transition ${
                isActive
                  ? 'bg-slate-900 text-white'
                  : 'text-slate-600 hover:bg-slate-100'
              }`
            }
          >
            {link.label}
          </NavLink>
        ))}
      </nav>
      <div className="mt-auto rounded-lg border border-slate-200 bg-slate-50 p-3 text-xs text-slate-600">
        <p className="font-semibold text-slate-700">Role</p>
        <p className="mt-1">Admin access enabled</p>
      </div>
    </aside>
  )
}

export default Sidebar
