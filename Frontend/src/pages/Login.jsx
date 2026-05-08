import { Link } from 'react-router-dom'

function Login() {
  return (
    <div className="min-h-screen bg-slate-50 px-4 py-12">
      <div className="mx-auto w-full max-w-md rounded-2xl border border-slate-200 bg-white p-8 shadow-sm">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">
          Task Manager
        </p>
        <h1 className="mt-2 text-2xl font-semibold text-slate-900">Sign in</h1>
        <p className="mt-3 text-sm text-slate-600">
          Use your work email and password to continue.
        </p>

        <form className="mt-6 grid gap-4">
          <label className="grid gap-2 text-sm text-slate-700">
            Work email
            <input
              type="email"
              placeholder="name@company.com"
              className="h-11 rounded-md border border-slate-200 bg-white px-3 text-sm text-slate-900 outline-none transition focus:border-slate-400"
            />
          </label>
          <label className="grid gap-2 text-sm text-slate-700">
            Password
            <input
              type="password"
              placeholder="••••••••"
              className="h-11 rounded-md border border-slate-200 bg-white px-3 text-sm text-slate-900 outline-none transition focus:border-slate-400"
            />
          </label>
          <div className="flex items-center justify-between text-xs text-slate-600">
            <label className="flex items-center gap-2">
              <input type="checkbox" className="h-4 w-4 accent-slate-900" />
              Keep me signed in
            </label>
            <button type="button" className="text-xs font-semibold text-slate-600">
              Forgot password
            </button>
          </div>
          <button
            type="submit"
            className="h-11 rounded-md bg-slate-900 text-xs font-semibold uppercase tracking-[0.3em] text-white transition hover:bg-slate-800"
          >
            Sign in
          </button>
        </form>

        <p className="mt-6 text-xs text-slate-500">
          New here?{' '}
          <Link to="/register" className="font-semibold text-slate-700">
            Create an account
          </Link>
        </p>
      </div>
    </div>
  )
}

export default Login
