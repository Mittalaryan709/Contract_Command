import { Navigate, Outlet } from 'react-router-dom'
import { useAuth } from '../context/AuthContext.jsx'
import LoadingSpinner from '../components/common/LoadingSpinner.jsx'

export default function RoleGuard({ allowedRoles = [] }) {
  const { user, loading } = useAuth()

  if (loading) {
    return <LoadingSpinner message="Verifying security credentials..." />
  }

  if (!user) {
    return <Navigate to="/login" replace />
  }

  const userRoles = user.groups || []
  const hasAccess =
    user.is_superuser ||
    allowedRoles.length === 0 ||
    allowedRoles.some(role => userRoles.includes(role))

  if (!hasAccess) {
    return <Navigate to="/unauthorized" replace />
  }

  return <Outlet />
}
