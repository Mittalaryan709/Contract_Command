import { useState } from 'react'
import { NavLink, Link, Outlet, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext.jsx'
import logoSvg from '../assets/logos/contractcommand-logo.svg'

export default function PublicLayout() {
  const { isAuthenticated } = useAuth()
  const navigate = useNavigate()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  const toggleMobileMenu = () => setMobileMenuOpen(prev => !prev)
  const closeMobileMenu = () => setMobileMenuOpen(false)

  return (
    <div className="d-flex flex-column min-vh-100">
      {/* Indian National Tricolour Accent Bar */}
      <div className="tricolour-bar">
        <div className="tricolour-saffron" />
        <div className="tricolour-white" />
        <div className="tricolour-green" />
      </div>

      {/* Main Navigation Header */}
      <nav className="navbar navbar-expand-lg navbar-dark sticky-top shadow-sm" style={{ backgroundColor: '#102A43' }}>
        <div className="container">
          <Link className="navbar-brand d-flex align-items-center" to="/" onClick={closeMobileMenu}>
            <img src={logoSvg} alt="ContractCommand Logo" height="38" className="d-inline-block" />
          </Link>

          {/* Mobile Menu Toggler */}
          <button
            className="navbar-toggler border-0"
            type="button"
            aria-label="Toggle navigation"
            onClick={toggleMobileMenu}
          >
            <i className={`bi ${mobileMenuOpen ? 'bi-x-lg' : 'bi-list'} fs-3 text-white`}></i>
          </button>

          {/* Navigation Links */}
          <div className={`collapse navbar-collapse ${mobileMenuOpen ? 'show' : ''}`} id="publicNavbar">
            <ul className="navbar-nav ms-auto align-items-lg-center gap-lg-2 my-2 my-lg-0">
              <li className="nav-item">
                <NavLink
                  className={({ isActive }) => `nav-link px-3 ${isActive ? 'text-white fw-semibold border-bottom border-warning' : 'text-white-50'}`}
                  to="/"
                  end
                  onClick={closeMobileMenu}
                >
                  Home
                </NavLink>
              </li>
              <li className="nav-item">
                <NavLink
                  className={({ isActive }) => `nav-link px-3 ${isActive ? 'text-white fw-semibold border-bottom border-warning' : 'text-white-50'}`}
                  to="/about"
                  onClick={closeMobileMenu}
                >
                  About
                </NavLink>
              </li>
              <li className="nav-item">
                <NavLink
                  className={({ isActive }) => `nav-link px-3 ${isActive ? 'text-white fw-semibold border-bottom border-warning' : 'text-white-50'}`}
                  to="/modules"
                  onClick={closeMobileMenu}
                >
                  Modules
                </NavLink>
              </li>
              <li className="nav-item">
                <NavLink
                  className={({ isActive }) => `nav-link px-3 ${isActive ? 'text-white fw-semibold border-bottom border-warning' : 'text-white-50'}`}
                  to="/announcements"
                  onClick={closeMobileMenu}
                >
                  Announcements
                </NavLink>
              </li>
              <li className="nav-item">
                <NavLink
                  className={({ isActive }) => `nav-link px-3 ${isActive ? 'text-white fw-semibold border-bottom border-warning' : 'text-white-50'}`}
                  to="/contact"
                  onClick={closeMobileMenu}
                >
                  Contact
                </NavLink>
              </li>
            </ul>

            {/* Portal Access Button */}
            <div className="ms-lg-3 my-2 my-lg-0">
              {isAuthenticated ? (
                <button
                  className="btn btn-sm btn-saffron px-3 py-2 shadow-sm d-flex align-items-center gap-2"
                  onClick={() => { closeMobileMenu(); navigate('/app/dashboard') }}
                >
                  <i className="bi bi-speedometer2"></i>
                  <span>Enter Dashboard</span>
                </button>
              ) : (
                <Link
                  to="/login"
                  className="btn btn-sm btn-saffron px-3 py-2 shadow-sm d-flex align-items-center gap-2"
                  onClick={closeMobileMenu}
                >
                  <i className="bi bi-shield-lock-fill"></i>
                  <span>Access Portal</span>
                </Link>
              )}
            </div>
          </div>
        </div>
      </nav>

      {/* Page Body */}
      <main className="flex-grow-1">
        <Outlet />
      </main>

      {/* Institutional Defence Sector Footer */}
      <footer style={{ backgroundColor: '#0B1F33', color: '#9FB3C8', borderTop: '2px solid #334E68' }}>
        <div className="container py-5">
          <div className="row g-4">
            {/* Column 1: Organization */}
            <div className="col-lg-4 col-md-6">
              <img src={logoSvg} alt="ContractCommand Logo" height="34" className="mb-3" />
              <p className="small text-white-50 lh-base">
                Centralized platform for transparent, accountable, and auditable management of defence contracts, procurement workflows, vendor performance evaluations, and financial processing.
              </p>
              <div className="d-flex gap-2 mt-3">
                <span className="badge" style={{ backgroundColor: '#102A43', border: '1px solid #334E68', color: '#E58A24' }}>
                  DAP 2020 Aligned
                </span>
                <span className="badge" style={{ backgroundColor: '#102A43', border: '1px solid #334E68', color: '#287A4B' }}>
                  Make in India
                </span>
                <span className="badge" style={{ backgroundColor: '#102A43', border: '1px solid #334E68', color: '#FFFFFF' }}>
                  Atmanirbhar Bharat
                </span>
              </div>
            </div>

            {/* Column 2: Quick Links */}
            <div className="col-lg-2 col-md-6">
              <h6 className="text-white fw-bold mb-3 text-uppercase" style={{ letterSpacing: '0.5px' }}>Platform</h6>
              <ul className="list-unstyled small d-flex flex-column gap-2 mb-0">
                <li><Link to="/" className="text-decoration-none text-white-50 hover-white">Home</Link></li>
                <li><Link to="/about" className="text-decoration-none text-white-50 hover-white">About Project</Link></li>
                <li><Link to="/modules" className="text-decoration-none text-white-50 hover-white">Platform Modules</Link></li>
                <li><Link to="/announcements" className="text-decoration-none text-white-50 hover-white">Announcements</Link></li>
                <li><Link to="/contact" className="text-decoration-none text-white-50 hover-white">Contact &amp; Support</Link></li>
                <li><Link to="/login" className="text-decoration-none text-white-50 hover-white">Portal Sign-in</Link></li>
              </ul>
            </div>

            {/* Column 3: Modules */}
            <div className="col-lg-3 col-md-6">
              <h6 className="text-white fw-bold mb-3 text-uppercase" style={{ letterSpacing: '0.5px' }}>Core Modules</h6>
              <ul className="list-unstyled small d-flex flex-column gap-2 mb-0 text-white-50">
                <li><i className="bi bi-file-earmark-text text-warning me-2"></i>Contract Lifecycle Management</li>
                <li><i className="bi bi-clipboard-check text-info me-2"></i>Procurement &amp; Requisitions</li>
                <li><i className="bi bi-building-check text-success me-2"></i>Vendor Evaluation &amp; Selection</li>
                <li><i className="bi bi-cash-stack text-warning me-2"></i>Invoice &amp; GST Payment Processing</li>
                <li><i className="bi bi-graph-up text-primary me-2"></i>Executive Analytics Dashboard</li>
              </ul>
            </div>

            {/* Column 4: Academic Disclaimer */}
            <div className="col-lg-3 col-md-6">
              <h6 className="text-white fw-bold mb-3 text-uppercase" style={{ letterSpacing: '0.5px' }}>Academic Notice</h6>
              <div className="p-3 rounded-2" style={{ backgroundColor: '#102A43', border: '1px solid rgba(255,255,255,0.08)' }}>
                <p className="small text-white-50 mb-2">
                  <strong>Project P07:</strong> MCA 2nd Year Capstone Companion Project developed under the HCLTech Career Shaper program at ABES Engineering College.
                </p>
                <p className="small text-muted mb-0" style={{ fontSize: '0.75rem' }}>
                  <strong>Disclaimer:</strong> This is an academic development prototype. It is not an official portal of the Ministry of Defence (MoD), Government of India, or DCMA. All data is synthetic.
                </p>
              </div>
            </div>
          </div>

          <hr className="my-4" style={{ borderColor: 'rgba(255, 255, 255, 0.1)' }} />

          {/* Sub-footer */}
          <div className="d-flex flex-column flex-md-row justify-content-between align-items-center small text-white-50">
            <div>
              &copy; 2026 ContractCommand. Developed for Academic Submission &ndash; ABES Engineering College.
            </div>
            <div className="mt-2 mt-md-0 d-flex gap-3">
              <span>Security: JWT Bearer RBAC</span>
              <span>&bull;</span>
              <span>Backend: Django REST Framework</span>
              <span>&bull;</span>
              <span>Database: MySQL 8.0 / SQLite</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
