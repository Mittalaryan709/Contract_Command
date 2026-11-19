import { createContext, useContext, useState, useEffect } from 'react'
import { login as apiLogin, logout as apiLogout, getProfile } from '../api/authApi.js'

export const AuthContext = createContext(null)

export const useAuth = () => useContext(AuthContext)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(() => !!localStorage.getItem('cc_access'))

  useEffect(() => {
    const token = localStorage.getItem('cc_access')
    if (token) {
      getProfile()
        .then(res => setUser(res.data?.data ?? res.data))
        .catch(() => {
          localStorage.removeItem('cc_access')
          localStorage.removeItem('cc_refresh')
          setUser(null)
        })
        .finally(() => setLoading(false))
    }
  }, [])

  const login = async (username, password) => {
    const res = await apiLogin(username, password)
    const { access, refresh } = res.data
    localStorage.setItem('cc_access', access)
    localStorage.setItem('cc_refresh', refresh)
    const profile = await getProfile()
    const userData = profile.data?.data ?? profile.data
    setUser(userData)
    return userData
  }

  const logout = async () => {
    const refresh = localStorage.getItem('cc_refresh')
    try {
      if (refresh) await apiLogout(refresh)
    } catch {
      // Ignore network errors on logout
    }
    localStorage.removeItem('cc_access')
    localStorage.removeItem('cc_refresh')
    setUser(null)
  }

  const getRole = () => user?.groups?.[0] ?? null
  const isAdmin = () => user?.groups?.includes('Administrator') ?? false
  const isContractsManager = () => user?.groups?.includes('Contracts Manager') ?? false
  const isSafetyOfficer = () => user?.groups?.includes('Safety Officer') ?? false
  const canWrite = () => isAdmin() || isContractsManager()
  const canDelete = () => isAdmin()

  return (
    <AuthContext.Provider value={{
      user, loading, isAuthenticated: !!user,
      login, logout, getRole, isAdmin, isContractsManager, isSafetyOfficer, canWrite, canDelete
    }}>
      {children}
    </AuthContext.Provider>
  )
}
