import axios from 'axios'

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:4000/api'
const TOKEN_KEY = 'wi_token'

export const api = axios.create({ baseURL: API_URL })

// Attach token
api.interceptors.request.use(config => {
  const token = localStorage.getItem(TOKEN_KEY)
  if (token) config.headers.Authorization = `Bearer ${token}`
  return config
})

// Handle 401 globally
api.interceptors.response.use(
  res => res,
  err => {
    if (err.response?.status === 401) {
      localStorage.removeItem(TOKEN_KEY)
    }
    return Promise.reject(err)
  },
)

export function setToken(token: string) {
  localStorage.setItem(TOKEN_KEY, token)
}
export function clearToken() {
  localStorage.removeItem(TOKEN_KEY)
}
export function getToken() {
  return localStorage.getItem(TOKEN_KEY)
}

// Extract a friendly error message
export function apiError(err: any): string {
  const msg = err?.response?.data?.message
  if (Array.isArray(msg)) return msg[0]
  return msg || err?.message || 'Có lỗi xảy ra, vui lòng thử lại'
}
