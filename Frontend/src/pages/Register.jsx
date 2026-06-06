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
  const [errors, setErrors] = useState([])

  const validateForm = () => {
    const newErrors = []
    if (!fullName) newErrors.push('Full name is required.')
    if (!email) newErrors.push('Email is required.')
    else if (!/^\S+@\S+\.\S+$/.test(email)) newErrors.push('Please enter a valid email address.')
    
    if (!password) newErrors.push('Password is required.')
    else {
      if (password.length < 6) newErrors.push('Password must be at least 6 characters.')
      if (!/[A-Z]/.test(password)) newErrors.push('Password must contain at least one uppercase letter.')
      if (!/[a-z]/.test(password)) newErrors.push('Password must contain at least one lowercase letter.')
      if (!/[0-9]/.test(password)) newErrors.push('Password must contain at least one number.')
      if (!/[^a-zA-Z0-9]/.test(password)) newErrors.push('Password must contain at least one special character.')
    }
    return newErrors
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setErrors([])

    // Client-side validation
    const validationErrors = validateForm()
    if (validationErrors.length > 0) {
      setErrors(validationErrors)
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
        setErrors([result.message || 'Registration failed.'])
      }
    } catch (err) {
      // Backend usually joins identity errors with a space or returns a specific message
      const msg = err.response?.data?.message || 'Registration failed. Please try again.'
      // Split by period to show multiple bullet points if there are multiple sentences
      const parsedErrors = msg.split('.').map(s => s.trim()).filter(s => s.length > 0)
      setErrors(parsedErrors.length > 0 ? parsedErrors : [msg])
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

        {errors.length > 0 && (
          <div className="mt-4 rounded-md border border-red-200 bg-red-50 p-4">
            <h3 className="text-sm font-medium text-red-800">Please correct the following errors:</h3>
            <ul className="mt-2 text-sm text-red-700 list-disc list-inside space-y-1">
              {errors.map((error, idx) => (
                <li key={idx}>{error}</li>
              ))}
            </ul>
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
