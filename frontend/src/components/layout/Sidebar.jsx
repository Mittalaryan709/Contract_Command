import { NavLink } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext.jsx'
import logoMark from '../../assets/logos/contractcommand-mark.svg'

function NavItem({ to, icon, label, badge, onClick }) {
  return (
    <NavLink
      to={to}
      onClick={onClick}
      className={({ isActive }) => `nav-link-sidebar ${isActive ? 'active' : ''}`}
    >
      <i className={`bi ${icon} fs-5`}></i>
      <span className="flex-grow-1">{label}</span>
      {badge && <span className="badge bg-warning text-dark" style={{ fontSize: '0.65rem' }}>{badge}</span>}
    </NavLink>
  )
}

export default function Sidebar({ isOpen, onClose }) {
  const { user, isAdmin, isSafetyOfficer } = useAuth()
  const roleName = user?.groups?.[0] || 'Authorized Staff'

  return (
    <>
      {/* Mobile backdrop */}
      {isOpen && (
        <div
          className="d-md-none position-fixed top-0 start-0 w-100 h-100"
          style={{ backgroundColor: 'rgba(0,0,0,0.5)', zIndex: 99 }}
          onClick={onClose}
        />
      )}

      <aside className={`sidebar d-flex flex-column ${isOpen ? 'show' : ''}`} style={{ zIndex: 100 }}>
        {/* Brand Header */}
        <div className="sidebar-brand d-flex align-items-center justify-content-between">
          <div className="d-flex align-items-center gap-2">
            <img src={logoMark} alt="Logo" height="36" />
            <div>
              <div className="text-white fw-bold" style={{ fontSize: '0.95rem', letterSpacing: '0.5px' }}>
                Contract<span style={{ color: '#E58A24' }}>Command</span>
              </div>
              <div className="text-white-50" style={{ fontSize: '0.68rem', letterSpacing: '1px' }}>
                DEFENCE PLATFORM
              </div>
            </div>
          </div>
          {/* Close button on mobile */}
          <button
            type="button"
            className="btn btn-link text-white-50 d-md-none p-0"
            onClick={onClose}
            aria-label="Close Sidebar"
          >
            <i className="bi bi-x-lg fs-5"></i>
          </button>
        </div>

        {/* Role Badge Banner */}
        <div className="px-3 py-2" style={{ backgroundColor: 'rgba(255, 255, 255, 0.05)', borderBottom: '1px solid rgba(255, 255, 255, 0.08)' }}>
          <div className="d-flex align-items-center justify-content-between">
            <span className="text-white-50" style={{ fontSize: '0.7rem', textTransform: 'uppercase' }}>Active Role</span>
            <span className={`badge ${isAdmin() ? 'bg-warning text-dark' : isSafetyOfficer() ? 'bg-success' : 'bg-info text-dark'}`} style={{ fontSize: '0.7rem' }}>
              {roleName}
            </span>
          </div>
        </div>

        {/* Navigation Links */}
        <nav className="flex-grow-1 py-3" style={{ overflowY: 'auto' }}>
          <NavItem to="/app/dashboard" icon="bi-speedometer2" label="Executive Dashboard" onClick={onClose} />

          {/* Module 1: Contracts */}
          <div style={{ padding: '14px 16px 4px', fontSize: '0.68rem', color: 'rgba(255,255,255,0.4)', textTransform: 'uppercase', letterSpacing: '1px' }}>
            Contracts Management
          </div>
          <NavItem to="/app/contracts" icon="bi-file-earmark-text" label="Contract Repository" onClick={onClose} />

          {/* Module 2: Procurement */}
          <div style={{ padding: '14px 16px 4px', fontSize: '0.68rem', color: 'rgba(255,255,255,0.4)', textTransform: 'uppercase', letterSpacing: '1px' }}>
            Procurement &amp; Requisitions
          </div>
          <NavItem to="/app/procurement/plans" icon="bi-clipboard-data" label="Procurement Plans" onClick={onClose} />
          <NavItem to="/app/procurement/requisitions" icon="bi-clipboard-check" label="Requisitions" onClick={onClose} />

          {/* Module 3: Vendors */}
          <div style={{ padding: '14px 16px 4px', fontSize: '0.68rem', color: 'rgba(255,255,255,0.4)', textTransform: 'uppercase', letterSpacing: '1px' }}>
            Suppliers &amp; Evaluation
          </div>
          <NavItem to="/app/vendors" icon="bi-building-check" label="Vendor Directory" onClick={onClose} />

          {/* Module 4: Finance */}
          <div style={{ padding: '14px 16px 4px', fontSize: '0.68rem', color: 'rgba(255,255,255,0.4)', textTransform: 'uppercase', letterSpacing: '1px' }}>
            Finance &amp; Disbursements
          </div>
          <NavItem to="/app/finance/invoices" icon="bi-receipt" label="GST Invoices" onClick={onClose} />
          <NavItem to="/app/finance/payments" icon="bi-cash-stack" label="Payment Records" onClick={onClose} />

          {/* User Profile Navigation */}
          <div style={{ padding: '14px 16px 4px', fontSize: '0.68rem', color: 'rgba(255,255,255,0.4)', textTransform: 'uppercase', letterSpacing: '1px' }}>
            Account &amp; Security
          </div>
          <NavItem to="/app/profile" icon="bi-person-badge" label="User Profile &amp; Security" onClick={onClose} />
        </nav>

        {/* User Mini Card Footer */}
        <div style={{ padding: '14px 16px', borderTop: '1px solid rgba(255,255,255,0.1)', backgroundColor: 'rgba(0,0,0,0.25)' }}>
          <NavLink to="/app/profile" onClick={onClose} style={{ textDecoration: 'none' }}>
            <div className="d-flex align-items-center gap-2">
              <div
                style={{
                  width: 38,
                  height: 38,
                  borderRadius: '50%',
                  backgroundColor: '#E58A24',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#fff',
                  fontWeight: 800,
                  fontSize: '0.95rem',
                  flexShrink: 0,
                }}
              >
                {user?.first_name?.[0] ?? user?.username?.[0] ?? 'U'}
              </div>
              <div style={{ overflow: 'hidden' }}>
                <div className="text-white fw-semibold text-truncate" style={{ fontSize: '0.84rem' }}>
                  {user?.full_name || user?.username}
                </div>
                <div className="text-warning text-truncate" style={{ fontSize: '0.7rem' }}>
                  {roleName}
                </div>
              </div>
            </div>
          </NavLink>
        </div>
      </aside>
    </>
  )
}
