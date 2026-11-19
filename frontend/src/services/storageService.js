/**
 * Storage Service for managing client-side auth tokens and user preferences.
 */
const TOKEN_KEY = 'cc_access'
const REFRESH_KEY = 'cc_refresh'
const USER_KEY = 'cc_user'

export const storageService = {
  getAccessToken: () => localStorage.getItem(TOKEN_KEY),
  setAccessToken: (token) => localStorage.setItem(TOKEN_KEY, token),
  removeAccessToken: () => localStorage.removeItem(TOKEN_KEY),

  getRefreshToken: () => localStorage.getItem(REFRESH_KEY),
  setRefreshToken: (token) => localStorage.setItem(REFRESH_KEY, token),
  removeRefreshToken: () => localStorage.removeItem(REFRESH_KEY),

  getUser: () => {
    try {
      const data = localStorage.getItem(USER_KEY)
      return data ? JSON.parse(data) : null
    } catch {
      return null
    }
  },
  setUser: (user) => localStorage.setItem(USER_KEY, JSON.stringify(user)),
  removeUser: () => localStorage.removeItem(USER_KEY),

  clearAll: () => {
    localStorage.removeItem(TOKEN_KEY)
    localStorage.removeItem(REFRESH_KEY)
    localStorage.removeItem(USER_KEY)
  },
}
