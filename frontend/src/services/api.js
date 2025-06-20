import axios from 'axios'

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000'

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json'
  },
  timeout: 10000
})

// Add response interceptor for error handling
api.interceptors.response.use(
  response => response,
  error => {
    console.error('API Error:', error.response?.data || error.message)
    return Promise.reject(error)
  }
)

export const userService = {
  getUsers: () => api.get('/api/users'),
  createUser: (userData) => api.post('/api/users', userData),
  deleteUser: (userId) => api.delete(`/api/users/${userId}`),
  healthCheck: () => api.get('/api/health')
}

export default api