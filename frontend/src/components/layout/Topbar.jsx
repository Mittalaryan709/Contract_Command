import { useLocation } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext.jsx'
import { useNavigate } from 'react-router-dom'

const BREADCRUMB_MAP = {
  '/app/dashboard': 'Dashboard',
  '/app/contracts': 'Contracts',
  '/app/procurement/plans': 'Procurement / Plans',
  '/app/procurement/requisitions': 'Procurement / Requisitions',
  '/app/vendors': 'Vendors',
  '/app/finance/invoices': 'Finance / Invoices',
  '/app/finance/payments': 'Finance / Payments',
  '/app/profile': 'My Profile',
}

export default function Topbar() {
  const { user, logout } = useAuth()
  const location = useLocation()
  const navigate = useNavigate()
  const breadcrumb = BREADCRUMB_MAP[location.pathname] ?? location.pathname.split('/').filter(Boolean).join(' / ')

  const handleLogout = async () => {
    await logout()
    navigate('/login')
  }

  return (
    <div className="topbar">
      <div className="d-flex align-items-center gap-2">
        <i className="bi bi-chevron-right text-muted small"></i>
        <span className="text-white-50 small">{breadcrumb}</span>
      </div>
      <div className="d-flex align-items-center gap-3">
        <div className="text-end d-none d-md-block">
          <div className="text-white" style={{ fontSize: '.85rem', fontWeight: 600 }}>{user?.full_name ?? user?.username}</div>
          <div style={{ fontSize: '.72rem', color: '#E58A24' }}>{user?.groups?.[0]}</div>
        </div>
        <button className="btn btn-sm btn-outline-light" onClick={handleLogout} title="Logout">
          <i className="bi bi-box-arrow-right"></i>
        </button>
      </div>
    </div>
  )
}
