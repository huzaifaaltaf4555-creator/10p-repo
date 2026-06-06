import apiClient from './apiClient'

/**
 * Get task statistics (completed, inProgress, pending counts).
 */
export const getTaskStats = async () => {
  const response = await apiClient.get('/tasks/stats')
  return response.data
}

/**
 * Get tasks with optional search, filter, and pagination.
 */
export const getTasks = async (params = {}) => {
  const response = await apiClient.get('/tasks', { params })
  return response.data
}

/**
 * Get current user's tasks only.
 */
export const getMyTasks = async (params = {}) => {
  const response = await apiClient.get('/tasks/my', { params })
  return response.data
}

/**
 * Get a single task by ID.
 */
export const getTaskById = async (taskId) => {
  const response = await apiClient.get(`/tasks/${taskId}`)
  return response.data
}

/**
 * Create a new task.
 */
export const createTask = async (taskData) => {
  const response = await apiClient.post('/tasks', taskData)
  return response.data
}

/**
 * Update an existing task.
 */
export const updateTask = async (taskId, taskData) => {
  const response = await apiClient.put(`/tasks/${taskId}`, taskData)
  return response.data
}

/**
 * Delete a task by ID.
 */
export const deleteTask = async (taskId) => {
  const response = await apiClient.delete(`/tasks/${taskId}`)
  return response.data
}
