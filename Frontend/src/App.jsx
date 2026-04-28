import { useState } from 'react'

function App() {
  const [mode, setMode] = useState('login')

  return (
    <div className="min-h-screen px-4 py-12">
      <div className="mx-auto w-full max-w-md">
        <div className="rounded-2xl border border-slate-200 bg-white p-8 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">
                Task Manager
              </p>
              <h1 className="mt-2 text-2xl font-semibold text-slate-900">
                {mode === 'login' ? 'Sign in' : 'Create account'}
              </h1>
            </div>
            <button
              type="button"
              onClick={() =>
                setMode((current) =>
                  current === 'login' ? 'register' : 'login',
                )
              }
              className="rounded-md border border-slate-200 px-3 py-2 text-xs font-semibold uppercase tracking-[0.2em] text-slate-600 transition hover:bg-slate-100"
            >
              {mode === 'login' ? 'Register' : 'Login'}
            </button>
          </div>

          <p className="mt-4 text-sm text-slate-600">
            Use your work email and password to continue.
          </p>

          <form className="mt-6 grid gap-4">
            {mode === 'register' && (
              <label className="grid gap-2 text-sm text-slate-700">
                Full name
                <input
                  type="text"
                  placeholder="Ayesha Khan"
                  className="h-11 rounded-md border border-slate-200 bg-white px-3 text-sm text-slate-900 outline-none transition focus:border-slate-400"
                />
              </label>
            )}

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

            {mode === 'register' && (
              <label className="grid gap-2 text-sm text-slate-700">
                Role
                <select className="h-11 rounded-md border border-slate-200 bg-white px-3 text-sm text-slate-900 outline-none transition focus:border-slate-400">
                  <option>Regular user</option>
                  <option>Admin</option>
                </select>
              </label>
            )}

            <div className="flex flex-col gap-3 text-xs text-slate-600 sm:flex-row sm:items-center sm:justify-between">
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
              {mode === 'login' ? 'Sign in' : 'Create account'}
            </button>
          </form>

          <p className="mt-6 text-xs text-slate-500">
            By continuing you agree to the platform terms and data policy.
          </p>
        </div>
      </div>
    </div>
  )
}

export default App
