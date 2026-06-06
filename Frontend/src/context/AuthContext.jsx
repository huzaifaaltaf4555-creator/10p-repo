import { createContext, useContext, useState, useEffect } from 'react'

// Create the auth context
const AuthContext = createContext(null)

/**
 * AuthProvider wraps the app and provides auth state + actions.
 * Stores JWT token and user info in localStorage.
 */
export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [token, setToken] = useState(null)
  const [loading, setLoading] = useState(true) // true while restoring session

  // Restore session from localStorage on mount
  useEffect(() => {
    const savedToken = localStorage.getItem('token')
    const savedUser = localStorage.getItem('user')

    if (savedToken && savedUser) {
      setToken(savedToken)
      setUser(JSON.parse(savedUser))
    }

    setLoading(false)
  }, [])

  // Save auth data to state + localStorage
  const saveAuth = (authData) => {
    const { token: newToken, ...userData } = authData
    setToken(newToken)
    setUser(userData)
    localStorage.setItem('token', newToken)
    localStorage.setItem('user', JSON.stringify(userData))
  }

  // Clear auth data
  const clearAuth = () => {
    setToken(null)
    setUser(null)
    localStorage.removeItem('token')
    localStorage.removeItem('user')
  }

  const isAuthenticated = !!token
  const isAdmin = user?.role === 'Admin'

  const value = {
    user,
    token,
    loading,
    isAuthenticated,
    isAdmin,
    saveAuth,
    clearAuth,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

/**
 * Hook to access auth context from any component.
 */
export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}
