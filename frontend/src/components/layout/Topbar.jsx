import { useState } from 'react'
import { useLocation, Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext.jsx'

const BREADCRUMB_CONFIG = {
  '/app/dashboard': [{ label: 'Platform', path: '/app/dashboard' }, { label: 'Dashboard' }],
  '/app/contracts': [{ label: 'Contracts', path: '/app/contracts' }, { label: 'Repository' }],
  '/app/contracts/new': [{ label: 'Contracts', path: '/app/contracts' }, { label: 'Create Contract' }],
  '/app/procurement/plans': [{ label: 'Procurement', path: '/app/procurement/plans' }, { label: 'Plans' }],
  '/app/procurement/plans/new': [{ label: 'Procurement', path: '/app/procurement/plans' }, { label: 'Create Plan' }],
  '/app/procurement/requisitions': [{ label: 'Procurement', path: '/app/procurement/plans' }, { label: 'Requisitions' }],
  '/app/procurement/requisitions/new': [{ label: 'Procurement', path: '/app/procurement/requisitions' }, { label: 'Create Requisition' }],
  '/app/vendors': [{ label: 'Vendors', path: '/app/vendors' }, { label: 'Directory' }],
  '/app/vendors/new': [{ label: 'Vendors', path: '/app/vendors' }, { label: 'Register Vendor' }],
  '/app/finance/invoices': [{ label: 'Finance', path: '/app/finance/invoices' }, { label: 'Invoices' }],
  '/app/finance/invoices/new': [{ label: 'Finance', path: '/app/finance/invoices' }, { label: 'Create Invoice' }],
  '/app/finance/payments': [{ label: 'Finance', path: '/app/finance/payments' }, { label: 'Payments' }],
  '/app/finance/payments/new': [{ label: 'Finance', path: '/app/finance/payments' }, { label: 'Record Payment' }],
  '/app/profile': [{ label: 'Account', path: '/app/profile' }, { label: 'Profile & Security' }],
}

export default function Topbar({ onToggleSidebar }) {
  const { user, logout } = useAuth()
  const location = useLocation()
  const navigate = useNavigate()
  const [showNotifications, setShowNotifications] = useState(false)
  const [showUserMenu, setShowUserMenu] = useState(false)

  const breadcrumbs = BREADCRUMB_CONFIG[location.pathname] || [
    { label: 'Platform', path: '/app/dashboard' },
    { label: location.pathname.replace('/app/', '').replace('/', ' / ') },
  ]

  const handleLogout = async () => {
    await logout()
    navigate('/login')
  }

  return (
    <header className="topbar">
      {/* Left: Mobile Toggle & Breadcrumbs */}
      <div className="d-flex align-items-center gap-3">
        {/* Mobile Sidebar Hamburger */}
        <button
          type="button"
          className="btn btn-link text-white d-md-none p-0 me-1"
          onClick={onToggleSidebar}
          aria-label="Toggle Sidebar Navigation"
        >
          <i className="bi bi-list fs-4"></i>
        </button>

        {/* Dynamic Breadcrumbs */}
        <nav aria-label="breadcrumb">
          <ol className="breadcrumb mb-0 small">
            {breadcrumbs.map((crumb, idx) => {
              const isLast = idx === breadcrumbs.length - 1
              return (
                <li
                  key={crumb.label}
                  className={`breadcrumb-item ${isLast ? 'active text-warning fw-semibold' : 'text-white-50'}`}
                >
                  {!isLast && crumb.path ? (
                    <Link to={crumb.path} className="text-white-50 text-decoration-none">
                      {crumb.label}
                    </Link>
                  ) : (
                    <span>{crumb.label}</span>
                  )}
                </li>
              )
            })}
          </ol>
        </nav>
      </div>

      {/* Right: Security Status, Notifications & User Actions */}
      <div className="d-flex align-items-center gap-3 position-relative">
        {/* Security / System indicator */}
        <div className="d-none d-lg-flex align-items-center gap-2 small text-white-50 border-end pe-3" style={{ borderColor: 'rgba(255,255,255,0.2)' }}>
          <span className="badge bg-success" style={{ fontSize: '0.65rem' }}>CONNECTED</span>
          <span>DAP 2020 AUDITED</span>
        </div>

        {/* Notification Bell Dropdown */}
        <div className="position-relative">
          <button
            type="button"
            className="btn btn-link text-white p-1 position-relative"
            onClick={() => setShowNotifications(!showNotifications)}
            aria-label="Notifications"
          >
            <i className="bi bi-bell-fill fs-5"></i>
            <span
              className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger"
              style={{ fontSize: '0.6rem' }}
            >
              3
            </span>
          </button>

          {showNotifications && (
            <div
              className="card shadow-lg border-0 position-absolute end-0 mt-2 py-0 text-dark rounded-3"
              style={{ width: '300px', zIndex: 1050 }}
            >
              <div className="card-header bg-light py-2 d-flex justify-content-between align-items-center">
                <span className="fw-bold small" style={{ color: '#102A43' }}>Operational Alerts</span>
                <span className="badge bg-warning text-dark">3 New</span>
              </div>
              <div className="list-group list-group-flush small" style={{ maxHeight: '250px', overflowY: 'auto' }}>
                <div className="list-group-item list-group-item-action py-2">
                  <div className="fw-semibold text-truncate">Requisition REQ-2024-001</div>
                  <div className="text-muted" style={{ fontSize: '0.72rem' }}>Awaiting Contracts Manager approval</div>
                </div>
                <div className="list-group-item list-group-item-action py-2">
                  <div className="fw-semibold text-truncate">Invoice INV-2024-00001</div>
                  <div className="text-muted" style={{ fontSize: '0.72rem' }}>18% GST verified &bull; Payment recorded</div>
                </div>
                <div className="list-group-item list-group-item-action py-2">
                  <div className="fw-semibold text-truncate">Bharat Electronics Ltd</div>
                  <div className="text-muted" style={{ fontSize: '0.72rem' }}>Vendor 4-pillar score calculated: 8.5/10</div>
                </div>
              </div>
              <div className="card-footer bg-light text-center py-1">
                <small className="text-muted" style={{ fontSize: '0.7rem' }}>Real-time Audit Stream</small>
              </div>
            </div>
          )}
        </div>

        {/* User Identity Info */}
        <div className="d-none d-md-block text-end">
          <div className="text-white fw-bold" style={{ fontSize: '0.85rem' }}>
            {user?.full_name || user?.username}
          </div>
          <div className="text-warning small" style={{ fontSize: '0.7rem' }}>
            {user?.groups?.[0] || 'Staff'}
          </div>
        </div>

        {/* User Dropdown / Logout */}
        <div className="position-relative">
          <button
            type="button"
            className="btn btn-sm btn-outline-light d-flex align-items-center gap-2"
            onClick={() => setShowUserMenu(!showUserMenu)}
            aria-label="User Menu"
          >
            <i className="bi bi-person-circle"></i>
            <i className="bi bi-chevron-down small"></i>
          </button>

          {showUserMenu && (
            <div
              className="card shadow-lg border-0 position-absolute end-0 mt-2 py-1 text-dark rounded-3"
              style={{ width: '180px', zIndex: 1050 }}
            >
              <Link
                to="/app/profile"
                className="dropdown-item py-2 px-3 small d-flex align-items-center gap-2"
                onClick={() => setShowUserMenu(false)}
              >
                <i className="bi bi-person-gear text-primary"></i>
                <span>Profile Settings</span>
              </Link>
              <hr className="dropdown-divider my-1" />
              <button
                type="button"
                className="dropdown-item py-2 px-3 small text-danger d-flex align-items-center gap-2"
                onClick={handleLogout}
              >
                <i className="bi bi-box-arrow-right"></i>
                <span>Sign Out</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  )
}
