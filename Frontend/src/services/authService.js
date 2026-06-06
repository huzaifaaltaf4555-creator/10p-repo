import apiClient from './apiClient'

/**
 * Login — sends credentials, returns auth response with JWT token.
 */
export const login = async (email, password) => {
  const response = await apiClient.post('/auth/login', { email, password })
  return response.data // { success, message, data: { token, userId, fullName, email, role } }
}

/**
 * Register — creates a new account, returns auth response with JWT token.
 */
export const register = async (fullName, email, password, role = 'User') => {
  const response = await apiClient.post('/auth/register', {
    fullName,
    email,
    password,
    role,
  })
  return response.data
}
