import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { useToast } from '../context/ToastContext'
import * as authService from '../services/authService'

function Register() {
  const navigate = useNavigate()
  const { saveAuth } = useAuth()
  const { showToast } = useToast()

  const [fullName, setFullName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [role, setRole] = useState('User')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')

    // Client-side validation
    if (!fullName || !email || !password) {
      setError('Please fill in all fields.')
      return
    }
    if (password.length < 6) {
      setError('Password must be at least 6 characters.')
      return
    }

    setLoading(true)
    try {
      const result = await authService.register(fullName, email, password, role)

      if (result.success) {
        saveAuth(result.data)
        showToast('Account created successfully!', 'success')
        navigate('/dashboard')
      } else {
        setError(result.message || 'Registration failed.')
      }
    } catch (err) {
      const msg = err.response?.data?.message || 'Registration failed. Please try again.'
      setError(msg)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-slate-50 px-4 py-12">
      <div className="mx-auto w-full max-w-md rounded-2xl border border-slate-200 bg-white p-8 shadow-sm">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">
          Task Manager
        </p>
        <h1 className="mt-2 text-2xl font-semibold text-slate-900">
          Create account
        </h1>
        <p className="mt-3 text-sm text-slate-600">
          Set up your profile to manage tasks and team visibility.
        </p>

        {error && (
          <div className="mt-4 rounded-md border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="mt-6 grid gap-4">
          <label className="grid gap-2 text-sm text-slate-700">
            Full name
            <input
              type="text"
              placeholder="Ayesha Khan"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              className="h-11 rounded-md border border-slate-200 bg-white px-3 text-sm text-slate-900 outline-none transition focus:border-slate-400"
            />
          </label>
          <label className="grid gap-2 text-sm text-slate-700">
            Work email
            <input
              type="email"
              placeholder="name@company.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="h-11 rounded-md border border-slate-200 bg-white px-3 text-sm text-slate-900 outline-none transition focus:border-slate-400"
            />
          </label>
          <label className="grid gap-2 text-sm text-slate-700">
            Password
            <input
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="h-11 rounded-md border border-slate-200 bg-white px-3 text-sm text-slate-900 outline-none transition focus:border-slate-400"
            />
          </label>
          <label className="grid gap-2 text-sm text-slate-700">
            Role
            <select
              value={role}
              onChange={(e) => setRole(e.target.value)}
              className="h-11 rounded-md border border-slate-200 bg-white px-3 text-sm text-slate-900 outline-none transition focus:border-slate-400"
            >
              <option value="User">Regular user</option>
              <option value="Admin">Admin</option>
            </select>
          </label>
          <button
            type="submit"
            disabled={loading}
            className="h-11 rounded-md bg-slate-900 text-xs font-semibold uppercase tracking-[0.3em] text-white transition hover:bg-slate-800 disabled:opacity-60"
          >
            {loading ? 'Creating account...' : 'Create account'}
          </button>
        </form>

        <p className="mt-6 text-xs text-slate-500">
          Already have an account?{' '}
          <Link to="/login" className="font-semibold text-slate-700">
            Sign in
          </Link>
        </p>
      </div>
    </div>
  )
}

export default Register
