import { apiRequest, shouldUseMock } from './apiClient'
import { mockTasks, mockStats } from '../data/mockData'

export const getTaskStats = async () => {
  if (shouldUseMock()) {
    return mockStats
  }

  return apiRequest('/tasks/stats')
}

export const getTasks = async () => {
  if (shouldUseMock()) {
    return mockTasks
  }

  return apiRequest('/tasks')
}

export const getTaskById = async (taskId) => {
  if (shouldUseMock()) {
    return mockTasks.find((task) => task.id === taskId)
  }

  return apiRequest(`/tasks/${taskId}`)
}

export const createTask = async () => {
  if (shouldUseMock()) {
    return { success: true }
  }

  return apiRequest('/tasks', { method: 'POST' })
}

export const updateTask = async (taskId) => {
  if (shouldUseMock()) {
    return { success: true, id: taskId }
  }

  return apiRequest(`/tasks/${taskId}`, { method: 'PUT' })
}
