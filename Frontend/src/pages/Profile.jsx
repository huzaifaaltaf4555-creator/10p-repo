import PageHeader from '../components/PageHeader'
import { mockUser } from '../data/mockData'

function Profile() {
  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="Profile"
        title="User profile"
        subtitle="Manage your personal details and role access."
        actions={
          <button className="rounded-md border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-600 transition hover:bg-slate-100">
            Edit profile
          </button>
        }
      />

      <div className="grid gap-6 md:grid-cols-[1.2fr_0.8fr]">
        <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <h3 className="text-sm font-semibold text-slate-900">Details</h3>
          <div className="mt-4 grid gap-4 text-sm text-slate-700">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.15em] text-slate-400">
                Full name
              </p>
              <p className="mt-1 font-semibold text-slate-900">{mockUser.name}</p>
            </div>
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.15em] text-slate-400">
                Email
              </p>
              <p className="mt-1 font-semibold text-slate-900">{mockUser.email}</p>
            </div>
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.15em] text-slate-400">
                Role
              </p>
              <p className="mt-1 font-semibold text-slate-900">{mockUser.role}</p>
            </div>
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.15em] text-slate-400">
                Team
              </p>
              <p className="mt-1 font-semibold text-slate-900">{mockUser.team}</p>
            </div>
          </div>
        </section>

        <aside className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <h3 className="text-sm font-semibold text-slate-900">Actions</h3>
          <div className="mt-4 grid gap-3 text-sm text-slate-600">
            <button className="rounded-md border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-100">
              Update password
            </button>
            <button className="rounded-md border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-100">
              Manage sessions
            </button>
            <button className="rounded-md bg-slate-900 px-4 py-2 text-sm font-semibold text-white transition hover:bg-slate-800">
              Log out
            </button>
          </div>
        </aside>
      </div>
    </div>
  )
}

export default Profile
