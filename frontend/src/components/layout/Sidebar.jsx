import { NavLink } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext.jsx'

function NavItem({ to, icon, label }) {
  return (
    <NavLink to={to} className={({ isActive }) => `nav-link-sidebar ${isActive ? 'active' : ''}`}>
      <i className={`bi ${icon}`}></i>
      <span>{label}</span>
    </NavLink>
  )
}

export default function Sidebar() {
  const { user } = useAuth()
  return (
    <div className="sidebar d-flex flex-column">
      {/* Brand */}
      <div className="sidebar-brand">
        <div className="d-flex align-items-center gap-2">
          <i className="bi bi-shield-fill-check fs-4" style={{ color: '#E58A24' }}></i>
          <div>
            <div className="text-white fw-bold" style={{ fontSize: '.95rem' }}>ContractCommand</div>
            <div style={{ fontSize: '.7rem', color: 'rgba(255,255,255,.5)' }}>P07 Defence Platform</div>
          </div>
        </div>
      </div>
      {/* Navigation */}
      <nav className="flex-grow-1 py-3">
        <NavItem to="/app/dashboard" icon="bi-speedometer2" label="Dashboard" />

        <div style={{ padding: '12px 16px 4px', fontSize: '.7rem', color: 'rgba(255,255,255,.4)', textTransform: 'uppercase', letterSpacing: '1px' }}>Contracts</div>
        <NavItem to="/app/contracts" icon="bi-file-earmark-text" label="Contracts" />

        <div style={{ padding: '12px 16px 4px', fontSize: '.7rem', color: 'rgba(255,255,255,.4)', textTransform: 'uppercase', letterSpacing: '1px' }}>Procurement</div>
        <NavItem to="/app/procurement/plans" icon="bi-clipboard-data" label="Plans" />
        <NavItem to="/app/procurement/requisitions" icon="bi-clipboard-check" label="Requisitions" />

        <div style={{ padding: '12px 16px 4px', fontSize: '.7rem', color: 'rgba(255,255,255,.4)', textTransform: 'uppercase', letterSpacing: '1px' }}>Vendors</div>
        <NavItem to="/app/vendors" icon="bi-building-check" label="Vendors" />

        <div style={{ padding: '12px 16px 4px', fontSize: '.7rem', color: 'rgba(255,255,255,.4)', textTransform: 'uppercase', letterSpacing: '1px' }}>Finance</div>
        <NavItem to="/app/finance/invoices" icon="bi-receipt" label="Invoices" />
        <NavItem to="/app/finance/payments" icon="bi-cash-stack" label="Payments" />
      </nav>
      {/* User card */}
      <div style={{ padding: '16px', borderTop: '1px solid rgba(255,255,255,.1)', background: 'rgba(0,0,0,.2)' }}>
        <NavLink to="/app/profile" style={{ textDecoration: 'none' }}>
          <div className="d-flex align-items-center gap-2">
            <div style={{ width: 36, height: 36, borderRadius: '50%', background: '#E58A24', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontWeight: 700, flexShrink: 0 }}>
              {user?.first_name?.[0] ?? user?.username?.[0] ?? 'U'}
            </div>
            <div style={{ overflow: 'hidden' }}>
              <div className="text-white" style={{ fontSize: '.82rem', fontWeight: 600, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                {user?.full_name ?? user?.username ?? 'User'}
              </div>
              <div style={{ fontSize: '.7rem', color: '#E58A24' }}>{user?.groups?.[0] ?? 'Staff'}</div>
            </div>
          </div>
        </NavLink>
      </div>
    </div>
  )
}
