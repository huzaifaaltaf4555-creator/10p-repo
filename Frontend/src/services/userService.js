import { apiRequest, shouldUseMock } from './apiClient'
import { mockUser } from '../data/mockData'

export const getProfile = async () => {
  if (shouldUseMock()) {
    return mockUser
  }

  return apiRequest('/users/me')
}
