import axios from 'axios'

// Use Vite env var VITE_API_URL (set in frontend/.env) or fall back to local backend
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api/v1',
  timeout: 10000,
})

export default api
