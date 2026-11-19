import { useState, useEffect, useRef } from 'react'
import { NavLink, Link, Outlet, useNavigate, useLocation } from 'react-router-dom'
import { useAuth } from '../context/AuthContext.jsx'
import logoSvg from '../assets/logos/contractcommand-logo.svg'

export default function PublicLayout() {
  const { isAuthenticated } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [mobileDropdown, setMobileDropdown] = useState(null)
  const [searchOpen, setSearchOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const searchInputRef = useRef(null)

  const toggleMobileMenu = () => setMobileMenuOpen(prev => !prev)
  const closeMobileMenu = () => {
    setMobileMenuOpen(false)
    setMobileDropdown(null)
  }

  const toggleMobileDropdown = (name) => {
    setMobileDropdown(prev => prev === name ? null : name)
  }

  const toggleSearch = () => {
    setSearchOpen(prev => {
      const next = !prev
      if (next) {
        setTimeout(() => searchInputRef.current?.focus(), 100)
      }
      return next
    })
  }

  // Close menus on route change
  useEffect(() => {
    setMobileMenuOpen(false)
    setMobileDropdown(null)
    setSearchOpen(false)
  }, [location.pathname])

  // Search items database for live search overlay
  const searchableItems = [
    { title: 'Contract Repository & Indent Management', url: '/modules#contracts', category: 'Module 1' },
    { title: 'Procurement Planning & Requisitions', url: '/modules#procurement', category: 'Module 2' },
    { title: 'Vendor Empanelment & 4-Pillar Evaluation', url: '/modules#vendors', category: 'Module 3' },
    { title: 'Invoice & 18% GST Payment Processing', url: '/modules#finance', category: 'Module 4' },
    { title: 'Project Overview & Objectives', url: '/about#overview', category: 'About' },
    { title: 'System Architecture & Security', url: '/about#architecture', category: 'Technical' },
    { title: 'Defence Acquisition Procedure (DAP 2020)', url: '/about#dap', category: 'Regulatory' },
    { title: 'Defence Circulars & Procurement Bulletins', url: '/announcements', category: 'Announcements' },
    { title: 'Directorate Helpdesk & Contact Officers', url: '/contact', category: 'Contact' },
    { title: 'Authorized Officer Portal Login', url: '/login', category: 'Authentication' },
  ]

  const searchResults = searchQuery.trim()
    ? searchableItems.filter(item =>
        item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.category.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : []

  return (
    <div className="d-flex flex-column min-vh-100">
      {/* 1. MAIN AGENCY HEADER & HORIZONTAL NAVIGATION (DCMA Structure) */}
      <header className="dcma-header sticky-top shadow-sm">
        <div className="container">
          <div className="d-flex align-items-center justify-content-between py-2 py-lg-0">
            {/* Agency Brand Identity */}
            <Link className="d-flex align-items-center text-decoration-none py-2" to="/" onClick={closeMobileMenu}>
              <img src={logoSvg} alt="ContractCommand Logo" height="46" className="d-inline-block" />
            </Link>

            {/* Mobile Actions: Search + Hamburger */}
            <div className="d-flex align-items-center gap-2 d-lg-none">
              <button
                type="button"
                className="btn btn-sm text-white"
                onClick={toggleSearch}
                aria-label="Toggle search"
              >
                <i className={`bi ${searchOpen ? 'bi-x-lg text-warning' : 'bi-search'} fs-5`}></i>
              </button>

              <button
                className="navbar-toggler border-0 text-white p-1"
                type="button"
                aria-label="Toggle navigation"
                onClick={toggleMobileMenu}
              >
                <i className={`bi ${mobileMenuOpen ? 'bi-x-lg' : 'bi-list'} fs-2`}></i>
              </button>
            </div>

            {/* Desktop Navigation Tabs */}
            <nav className="d-none d-lg-flex align-items-center">
              {/* TAB 1: HOME */}
              <div className="dcma-nav-item">
                <NavLink
                  to="/"
                  end
                  className={({ isActive }) => `dcma-nav-tab ${isActive ? 'active' : ''}`}
                >
                  Home
                </NavLink>
              </div>

              {/* TAB 2: ABOUT (Dropdown) */}
              <div className="dcma-nav-item">
                <button type="button" className="dcma-nav-tab">
                  <span>About</span>
                  <i className="bi bi-chevron-down dcma-chevron"></i>
                </button>
                <div className="dcma-dropdown-menu">
                  <Link to="/about" className="dcma-dropdown-link">
                    <i className="bi bi-info-circle"></i>
                    <span>About ContractCommand</span>
                  </Link>
                  <Link to="/about#overview" className="dcma-dropdown-link">
                    <i className="bi bi-journal-text"></i>
                    <span>Project Overview</span>
                  </Link>
                  <Link to="/about#objectives" className="dcma-dropdown-link">
                    <i className="bi bi-bullseye"></i>
                    <span>Objectives</span>
                  </Link>
                  <Link to="/about#approach" className="dcma-dropdown-link">
                    <i className="bi bi-shield-check"></i>
                    <span>Our Approach</span>
                  </Link>
                </div>
              </div>

              {/* TAB 3: MODULES (Dropdown) */}
              <div className="dcma-nav-item">
                <button type="button" className="dcma-nav-tab">
                  <span>Modules</span>
                  <i className="bi bi-chevron-down dcma-chevron"></i>
                </button>
                <div className="dcma-dropdown-menu">
                  <Link to="/modules#contracts" className="dcma-dropdown-link">
                    <i className="bi bi-file-earmark-text"></i>
                    <span>Contract Management</span>
                  </Link>
                  <Link to="/modules#procurement" className="dcma-dropdown-link">
                    <i className="bi bi-clipboard-check"></i>
                    <span>Procurement Management</span>
                  </Link>
                  <Link to="/modules#vendors" className="dcma-dropdown-link">
                    <i className="bi bi-building-check"></i>
                    <span>Vendor Evaluation</span>
                  </Link>
                  <Link to="/modules#finance" className="dcma-dropdown-link">
                    <i className="bi bi-cash-stack"></i>
                    <span>Invoice &amp; Payment Management</span>
                  </Link>
                  <Link to="/modules" className="dcma-dropdown-link border-top border-secondary">
                    <i className="bi bi-grid-3x3-gap"></i>
                    <span>All Platform Modules</span>
                  </Link>
                </div>
              </div>

              {/* TAB 4: ANNOUNCEMENTS (Dropdown) */}
              <div className="dcma-nav-item">
                <button type="button" className="dcma-nav-tab">
                  <span>Announcements</span>
                  <i className="bi bi-chevron-down dcma-chevron"></i>
                </button>
                <div className="dcma-dropdown-menu">
                  <Link to="/announcements#latest" className="dcma-dropdown-link">
                    <i className="bi bi-megaphone"></i>
                    <span>Latest Updates</span>
                  </Link>
                  <Link to="/announcements#procurement" className="dcma-dropdown-link">
                    <i className="bi bi-file-earmark-diff"></i>
                    <span>Procurement Updates</span>
                  </Link>
                  <Link to="/announcements#news" className="dcma-dropdown-link">
                    <i className="bi bi-newspaper"></i>
                    <span>Project News</span>
                  </Link>
                  <Link to="/announcements#notices" className="dcma-dropdown-link">
                    <i className="bi bi-bell"></i>
                    <span>Notices</span>
                  </Link>
                </div>
              </div>

              {/* TAB 5: RESOURCES (Dropdown) */}
              <div className="dcma-nav-item">
                <button type="button" className="dcma-nav-tab">
                  <span>Resources</span>
                  <i className="bi bi-chevron-down dcma-chevron"></i>
                </button>
                <div className="dcma-dropdown-menu">
                  <Link to="/about#resources" className="dcma-dropdown-link">
                    <i className="bi bi-book"></i>
                    <span>User Guide</span>
                  </Link>
                  <Link to="/about#docs" className="dcma-dropdown-link">
                    <i className="bi bi-file-earmark-code"></i>
                    <span>Documentation</span>
                  </Link>
                  <Link to="/contact" className="dcma-dropdown-link">
                    <i className="bi bi-headset"></i>
                    <span>Help &amp; Support</span>
                  </Link>
                </div>
              </div>

              {/* TAB 6: CONTACT */}
              <div className="dcma-nav-item">
                <NavLink
                  to="/contact"
                  className={({ isActive }) => `dcma-nav-tab ${isActive ? 'active' : ''}`}
                >
                  Contact
                </NavLink>
              </div>

              {/* TAB 7: SEARCH ICON */}
              <button
                type="button"
                className="dcma-search-btn"
                onClick={toggleSearch}
                title="Search platform content"
                aria-label="Search ContractCommand"
              >
                <i className={`bi ${searchOpen ? 'bi-x-lg text-warning' : 'bi-search'}`}></i>
              </button>

              {/* TAB 8: ACCESS PORTAL BUTTON */}
              <div className="ms-2">
                {isAuthenticated ? (
                  <button
                    className="btn btn-sm btn-saffron px-3 py-2 shadow-sm d-flex align-items-center gap-2 rounded-1 text-uppercase"
                    onClick={() => navigate('/app/dashboard')}
                    style={{ fontSize: '0.82rem', letterSpacing: '0.5px' }}
                  >
                    <i className="bi bi-speedometer2"></i>
                    <span>Enter Dashboard</span>
                  </button>
                ) : (
                  <Link
                    to="/login"
                    className="btn btn-sm btn-saffron px-3 py-2 shadow-sm d-flex align-items-center gap-2 rounded-1 text-uppercase"
                    style={{ fontSize: '0.82rem', letterSpacing: '0.5px' }}
                  >
                    <i className="bi bi-shield-lock-fill"></i>
                    <span>Access Portal</span>
                  </Link>
                )}
              </div>
            </nav>
          </div>
        </div>

        {/* 3. SEARCH OVERLAY BAR (Toggled via Search Icon) */}
        {searchOpen && (
          <div className="dcma-search-overlay">
            <div className="container">
              <div className="position-relative">
                <div className="input-group">
                  <span className="input-group-text bg-white border-0">
                    <i className="bi bi-search text-muted"></i>
                  </span>
                  <input
                    ref={searchInputRef}
                    type="text"
                    className="form-control border-0 py-2"
                    placeholder="Search defence contracts, procurement guidelines, vendor evaluation criteria, or announcements..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                  {searchQuery && (
                    <button
                      className="btn btn-white bg-white text-muted border-0"
                      type="button"
                      onClick={() => setSearchQuery('')}
                    >
                      <i className="bi bi-x-lg"></i>
                    </button>
                  )}
                  <button
                    className="btn btn-saffron px-4 fw-bold"
                    type="button"
                    onClick={() => {
                      if (searchResults.length > 0) {
                        navigate(searchResults[0].url)
                        setSearchOpen(false)
                      }
                    }}
                  >
                    Search
                  </button>
                </div>

                {/* Instant Search Results Dropdown */}
                {searchQuery.trim() && (
                  <div
                    className="card border-0 shadow-lg mt-2 position-absolute w-100 bg-white rounded-2 overflow-hidden"
                    style={{ zIndex: 1100, maxHeight: '320px', overflowY: 'auto' }}
                  >
                    <div className="card-header bg-light py-2 small fw-bold text-muted text-uppercase" style={{ fontSize: '0.72rem' }}>
                      Search Results ({searchResults.length})
                    </div>
                    <div className="list-group list-group-flush">
                      {searchResults.length === 0 ? (
                        <div className="p-3 text-muted small text-center">
                          No matching platform items found for "{searchQuery}".
                        </div>
                      ) : (
                        searchResults.map((item, idx) => (
                          <Link
                            key={idx}
                            to={item.url}
                            className="list-group-item list-group-item-action d-flex justify-content-between align-items-center py-2"
                            onClick={() => setSearchOpen(false)}
                          >
                            <span className="fw-semibold text-dark small">{item.title}</span>
                            <span className="badge bg-light text-secondary border small">{item.category}</span>
                          </Link>
                        ))
                      )}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* 4. MOBILE NAVIGATION ACCORDION (For Tablet & Phone) */}
        {mobileMenuOpen && (
          <div className="dcma-navbar-collapse d-lg-none">
            <div className="container py-2">
              <ul className="list-unstyled mb-0">
                {/* Home */}
                <li>
                  <Link to="/" className="dcma-nav-tab" onClick={closeMobileMenu}>
                    <span>Home</span>
                  </Link>
                </li>

                {/* About Accordion */}
                <li>
                  <button
                    type="button"
                    className="dcma-nav-tab"
                    onClick={() => toggleMobileDropdown('about')}
                  >
                    <span>About</span>
                    <i className={`bi bi-chevron-${mobileDropdown === 'about' ? 'up' : 'down'} text-warning`}></i>
                  </button>
                  <div className={`dcma-dropdown-menu ${mobileDropdown === 'about' ? 'mobile-open' : ''}`}>
                    <Link to="/about" className="dcma-dropdown-link" onClick={closeMobileMenu}>About ContractCommand</Link>
                    <Link to="/about#overview" className="dcma-dropdown-link" onClick={closeMobileMenu}>Project Overview</Link>
                    <Link to="/about#objectives" className="dcma-dropdown-link" onClick={closeMobileMenu}>Objectives</Link>
                    <Link to="/about#approach" className="dcma-dropdown-link" onClick={closeMobileMenu}>Our Approach</Link>
                  </div>
                </li>

                {/* Modules Accordion */}
                <li>
                  <button
                    type="button"
                    className="dcma-nav-tab"
                    onClick={() => toggleMobileDropdown('modules')}
                  >
                    <span>Modules</span>
                    <i className={`bi bi-chevron-${mobileDropdown === 'modules' ? 'up' : 'down'} text-warning`}></i>
                  </button>
                  <div className={`dcma-dropdown-menu ${mobileDropdown === 'modules' ? 'mobile-open' : ''}`}>
                    <Link to="/modules#contracts" className="dcma-dropdown-link" onClick={closeMobileMenu}>Contract Management</Link>
                    <Link to="/modules#procurement" className="dcma-dropdown-link" onClick={closeMobileMenu}>Procurement Management</Link>
                    <Link to="/modules#vendors" className="dcma-dropdown-link" onClick={closeMobileMenu}>Vendor Evaluation</Link>
                    <Link to="/modules#finance" className="dcma-dropdown-link" onClick={closeMobileMenu}>Invoice &amp; Payment Management</Link>
                    <Link to="/modules" className="dcma-dropdown-link" onClick={closeMobileMenu}>All Modules</Link>
                  </div>
                </li>

                {/* Announcements Accordion */}
                <li>
                  <button
                    type="button"
                    className="dcma-nav-tab"
                    onClick={() => toggleMobileDropdown('announcements')}
                  >
                    <span>Announcements</span>
                    <i className={`bi bi-chevron-${mobileDropdown === 'announcements' ? 'up' : 'down'} text-warning`}></i>
                  </button>
                  <div className={`dcma-dropdown-menu ${mobileDropdown === 'announcements' ? 'mobile-open' : ''}`}>
                    <Link to="/announcements#latest" className="dcma-dropdown-link" onClick={closeMobileMenu}>Latest Updates</Link>
                    <Link to="/announcements#procurement" className="dcma-dropdown-link" onClick={closeMobileMenu}>Procurement Updates</Link>
                    <Link to="/announcements#news" className="dcma-dropdown-link" onClick={closeMobileMenu}>Project News</Link>
                    <Link to="/announcements#notices" className="dcma-dropdown-link" onClick={closeMobileMenu}>Notices</Link>
                  </div>
                </li>

                {/* Resources Accordion */}
                <li>
                  <button
                    type="button"
                    className="dcma-nav-tab"
                    onClick={() => toggleMobileDropdown('resources')}
                  >
                    <span>Resources</span>
                    <i className={`bi bi-chevron-${mobileDropdown === 'resources' ? 'up' : 'down'} text-warning`}></i>
                  </button>
                  <div className={`dcma-dropdown-menu ${mobileDropdown === 'resources' ? 'mobile-open' : ''}`}>
                    <Link to="/about#resources" className="dcma-dropdown-link" onClick={closeMobileMenu}>User Guide</Link>
                    <Link to="/about#docs" className="dcma-dropdown-link" onClick={closeMobileMenu}>Documentation</Link>
                    <Link to="/contact" className="dcma-dropdown-link" onClick={closeMobileMenu}>Help &amp; Support</Link>
                  </div>
                </li>

                {/* Contact */}
                <li>
                  <Link to="/contact" className="dcma-nav-tab" onClick={closeMobileMenu}>
                    <span>Contact</span>
                  </Link>
                </li>

                {/* Portal Access Button Mobile */}
                <li className="pt-3">
                  {isAuthenticated ? (
                    <button
                      className="btn btn-saffron w-100 py-2 d-flex align-items-center justify-content-center gap-2 text-uppercase"
                      onClick={() => { closeMobileMenu(); navigate('/app/dashboard') }}
                    >
                      <i className="bi bi-speedometer2"></i>
                      <span>Enter Dashboard</span>
                    </button>
                  ) : (
                    <Link
                      to="/login"
                      className="btn btn-saffron w-100 py-2 d-flex align-items-center justify-content-center gap-2 text-uppercase"
                      onClick={closeMobileMenu}
                    >
                      <i className="bi bi-shield-lock-fill"></i>
                      <span>Access Portal</span>
                    </Link>
                  )}
                </li>
              </ul>
            </div>
          </div>
        )}
      </header>

      {/* Page Body */}
      <main className="flex-grow-1">
        <Outlet />
      </main>

      {/* 5. DCMA-INSPIRED FOOTER ARCHITECTURE */}
      <footer className="dcma-footer pt-5 pb-4">
        <div className="container">
          <div className="row g-4">
            {/* Column 1: Organization & Identity */}
            <div className="col-lg-5 col-md-12">
              <img src={logoSvg} alt="ContractCommand Logo" height="42" className="mb-3" />
              <p className="small text-white-50 lh-base mb-3" style={{ maxWidth: 460 }}>
                ContractCommand is an enterprise defence contract, procurement planning, contractor evaluation, and milestone settlement platform engineered for transparent, auditable, and resilient acquisitions.
              </p>
              <div className="d-flex flex-wrap gap-2">
                <span className="badge" style={{ backgroundColor: '#102F53', border: '1px solid #173B63', color: '#FF9933' }}>
                  DAP 2020 / DPM 2025
                </span>
                <span className="badge" style={{ backgroundColor: '#102F53', border: '1px solid #173B63', color: '#138808' }}>
                  Make in India
                </span>
                <span className="badge" style={{ backgroundColor: '#102F53', border: '1px solid #173B63', color: '#FFFFFF' }}>
                  Atmanirbhar Bharat
                </span>
              </div>
            </div>

            {/* Column 2: Navigation Links */}
            <div className="col-lg-3 col-md-6">
              <h6 className="text-white fw-bold mb-3 text-uppercase" style={{ letterSpacing: '0.6px', fontSize: '0.85rem' }}>
                Navigation
              </h6>
              <ul className="list-unstyled small d-flex flex-column gap-2 mb-0">
                <li><Link to="/">Home Portal</Link></li>
                <li><Link to="/about">About ContractCommand</Link></li>
                <li><Link to="/modules">Platform Modules</Link></li>
                <li><Link to="/announcements">News &amp; Bulletins</Link></li>
                <li><Link to="/about#resources">User Resources</Link></li>
                <li><Link to="/contact">Contact Directorate</Link></li>
                <li><Link to="/login">Officer Sign-in</Link></li>
              </ul>
            </div>

            {/* Column 3: Core Procurement Modules */}
            <div className="col-lg-4 col-md-6">
              <h6 className="text-white fw-bold mb-3 text-uppercase" style={{ letterSpacing: '0.6px', fontSize: '0.85rem' }}>
                Acquisition Modules
              </h6>
              <ul className="list-unstyled small d-flex flex-column gap-2 mb-0 text-white-50">
                <li>
                  <Link to="/modules#contracts" className="d-flex align-items-center gap-2">
                    <i className="bi bi-file-earmark-text text-warning"></i>
                    <span>Contract Lifecycle Management</span>
                  </Link>
                </li>
                <li>
                  <Link to="/modules#procurement" className="d-flex align-items-center gap-2">
                    <i className="bi bi-clipboard-check text-info"></i>
                    <span>Procurement &amp; Requisitions</span>
                  </Link>
                </li>
                <li>
                  <Link to="/modules#vendors" className="d-flex align-items-center gap-2">
                    <i className="bi bi-building-check text-success"></i>
                    <span>Vendor Evaluation &amp; Empanelment</span>
                  </Link>
                </li>
                <li>
                  <Link to="/modules#finance" className="d-flex align-items-center gap-2">
                    <i className="bi bi-cash-stack text-warning"></i>
                    <span>Invoice &amp; 18% GST Disbursements</span>
                  </Link>
                </li>
                <li>
                  <Link to="/login" className="d-flex align-items-center gap-2">
                    <i className="bi bi-graph-up text-primary"></i>
                    <span>Command Analytics Dashboard</span>
                  </Link>
                </li>
              </ul>
            </div>
          </div>

          <hr className="my-4" style={{ borderColor: 'rgba(255, 255, 255, 0.1)' }} />

          {/* Sub-Footer */}
          <div className="d-flex flex-column flex-md-row justify-content-between align-items-center small text-white-50">
            <div>
              &copy; 2026 ContractCommand. Defence Contract and Procurement Management Platform.
            </div>
            <div className="mt-2 mt-md-0 d-flex gap-3">
              <Link to="/about" className="text-white-50 text-decoration-none">About</Link>
              <span>&bull;</span>
              <Link to="/modules" className="text-white-50 text-decoration-none">Modules</Link>
              <span>&bull;</span>
              <Link to="/announcements" className="text-white-50 text-decoration-none">Announcements</Link>
              <span>&bull;</span>
              <Link to="/contact" className="text-white-50 text-decoration-none">Contact</Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
