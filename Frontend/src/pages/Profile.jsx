import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { useToast } from '../context/ToastContext'
import PageHeader from '../components/PageHeader'
import LoadingSpinner from '../components/LoadingSpinner'
import * as userService from '../services/userService'
import { formatDate } from '../services/formatters'

function Profile() {
  const navigate = useNavigate()
  const { clearAuth, user: authUser } = useAuth()
  const { showToast } = useToast()

  const [profile, setProfile] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const result = await userService.getProfile()
        if (result.success) {
          setProfile(result.data)
        }
      } catch (err) {
        console.error('Failed to load profile:', err)
      } finally {
        setLoading(false)
      }
    }

    fetchProfile()
  }, [])

  const handleLogout = () => {
    clearAuth()
    showToast('Logged out successfully.', 'info')
    navigate('/login')
  }

  if (loading) return <LoadingSpinner message="Loading profile..." />

  const user = profile || authUser || {}

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="Profile"
        title="User profile"
        subtitle="Manage your personal details and role access."
      />

      <div className="grid gap-6 md:grid-cols-[1.2fr_0.8fr]">
        <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <h3 className="text-sm font-semibold text-slate-900">Details</h3>
          <div className="mt-4 grid gap-4 text-sm text-slate-700">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.15em] text-slate-400">
                Full name
              </p>
              <p className="mt-1 font-semibold text-slate-900">
                {user.fullName || 'N/A'}
              </p>
            </div>
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.15em] text-slate-400">
                Email
              </p>
              <p className="mt-1 font-semibold text-slate-900">
                {user.email || 'N/A'}
              </p>
            </div>
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.15em] text-slate-400">
                Role
              </p>
              <p className="mt-1 font-semibold text-slate-900">
                {user.role || 'N/A'}
              </p>
            </div>
            {user.createdAt && (
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.15em] text-slate-400">
                  Member since
                </p>
                <p className="mt-1 font-semibold text-slate-900">
                  {formatDate(user.createdAt)}
                </p>
              </div>
            )}
          </div>
        </section>

        <aside className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <h3 className="text-sm font-semibold text-slate-900">Actions</h3>
          <div className="mt-4 grid gap-3 text-sm text-slate-600">
            <button
              onClick={handleLogout}
              className="rounded-md bg-slate-900 px-4 py-2 text-sm font-semibold text-white transition hover:bg-slate-800"
            >
              Log out
            </button>
          </div>
        </aside>
      </div>
    </div>
  )
}

export default Profile
