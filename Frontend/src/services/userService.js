import apiClient from './apiClient'

/**
 * Get the current logged-in user's profile.
 */
export const getProfile = async () => {
  const response = await apiClient.get('/users/me')
  return response.data
}
