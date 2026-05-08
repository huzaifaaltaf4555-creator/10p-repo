import { apiRequest, shouldUseMock } from './apiClient'
import { mockUser } from '../data/mockData'

export const login = async () => {
  if (shouldUseMock()) {
    return { token: 'mock-token', user: mockUser }
  }

  return apiRequest('/auth/login', { method: 'POST' })
}

export const register = async () => {
  if (shouldUseMock()) {
    return { token: 'mock-token', user: mockUser }
  }

  return apiRequest('/auth/register', { method: 'POST' })
}

export const logout = async () => {
  if (shouldUseMock()) {
    return true
  }

  return apiRequest('/auth/logout', { method: 'POST' })
}
