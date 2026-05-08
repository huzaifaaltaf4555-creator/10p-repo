const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || ''

const buildUrl = (path) => {
  if (!API_BASE_URL) {
    return path
  }

  return `${API_BASE_URL.replace(/\/$/, '')}/${path.replace(/^\//, '')}`
}

export const shouldUseMock = () => !API_BASE_URL

export const apiRequest = async (path, options = {}) => {
  const response = await fetch(buildUrl(path), {
    headers: {
      'Content-Type': 'application/json',
      ...(options.headers || {}),
    },
    ...options,
  })

  if (!response.ok) {
    const message = await response.text()
    throw new Error(message || 'Request failed')
  }

  if (response.status === 204) {
    return null
  }

  return response.json()
}
