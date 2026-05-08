import { Outlet } from 'react-router-dom'
import Sidebar from '../components/Sidebar'
import TopBar from '../components/TopBar'

function AppShell() {
  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      <div className="mx-auto flex w-full max-w-6xl gap-6 px-4 py-6 md:px-8">
        <Sidebar />
        <div className="flex-1">
          <TopBar />
          <main className="mt-6">
            <Outlet />
          </main>
        </div>
      </div>
    </div>
  )
}

export default AppShell
