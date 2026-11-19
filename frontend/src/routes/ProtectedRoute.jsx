import { Navigate, Outlet } from 'react-router-dom'
import { useAuth } from '../context/AuthContext.jsx'
import LoadingSpinner from '../components/common/LoadingSpinner.jsx'

export default function ProtectedRoute() {
  const { isAuthenticated, loading } = useAuth()
  if (loading) return <LoadingSpinner />
  return isAuthenticated ? <Outlet /> : <Navigate to="/login" replace />
}
