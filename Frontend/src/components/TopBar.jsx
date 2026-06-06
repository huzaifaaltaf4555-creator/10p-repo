import { NavLink, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { useToast } from '../context/ToastContext'

function TopBar() {
  const { user, clearAuth } = useAuth()
  const { showToast } = useToast()
  const navigate = useNavigate()

  const handleLogout = () => {
    clearAuth()
    showToast('Logged out.', 'info')
    navigate('/login')
  }

  return (
    <header className="flex flex-col gap-3 rounded-2xl border border-slate-200 bg-white px-5 py-4 shadow-sm sm:flex-row sm:items-center sm:justify-between">
      <div>
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">
          Task Manager
        </p>
        <h1 className="mt-2 text-xl font-semibold text-slate-900">
          Operations Dashboard
        </h1>
      </div>
      <div className="flex flex-wrap items-center gap-2">
        <NavLink
          to="/tasks/new"
          className="rounded-md bg-slate-900 px-4 py-2 text-sm font-semibold text-white transition hover:bg-slate-800"
        >
          New task
        </NavLink>
        <span className="hidden text-sm text-slate-500 sm:inline">
          {user?.fullName}
        </span>
        <button
          onClick={handleLogout}
          className="rounded-md border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-600 transition hover:bg-slate-100"
        >
          Logout
        </button>
      </div>
    </header>
  )
}

export default TopBar
