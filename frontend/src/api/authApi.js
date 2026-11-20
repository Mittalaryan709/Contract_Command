import api from './axiosInstance.js'
import axios from 'axios'

const rawBaseUrl = import.meta.env.VITE_API_BASE_URL || (import.meta.env.DEV ? 'http://127.0.0.1:8000' : 'https://contractcommand-backend.onrender.com')
const BASE_URL = rawBaseUrl.replace(/\/+$/, '')

// Login returns raw tokens (no envelope wrapper)
export const login = (username, password) =>
  axios.post(`${BASE_URL}/api/auth/login/`, { username, password }, { timeout: 45000 })

export const logout = (refresh) =>
  api.post('/api/auth/logout/', { refresh })

export const getProfile = () => api.get('/api/auth/profile/')

export const updateProfile = (data) => api.put('/api/auth/profile/', data)

export const changePassword = (data) => api.post('/api/auth/change-password/', data)

export const getUsers = () => api.get('/api/auth/users/')

export const refreshToken = (refresh) =>
  axios.post(`${BASE_URL}/api/auth/token/refresh/`, { refresh }, { timeout: 45000 })
