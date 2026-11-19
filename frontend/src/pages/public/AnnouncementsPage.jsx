import { Link } from 'react-router-dom'

export default function AnnouncementsPage() {
  const announcements = [
    {
      id: 1,
      title: 'ContractCommand Platform Foundation & Phase 1 Release',
      category: 'System Release',
      date: '19-11-2026',
      badgeColor: 'success',
      summary: 'Frontend foundation initialized on React 18 and Vite. Centralized Axios client, JWT authentication lifecycle, responsive navigation shell, and complete 3NF database model integration established.',
      audience: 'All Stakeholders',
    },
    {
      id: 2,
      title: 'Alignment with Defence Acquisition Procedure (DAP 2020) Guidelines',
      category: 'Compliance Policy',
      date: '15-11-2026',
      badgeColor: 'warning',
      summary: 'Procurement workflows and vendor classifications updated to support domestic sourcing indicators, Make in India categories, and 4-pillar objective supplier evaluation matrices.',
      audience: 'Contracts Managers & Evaluators',
    },
    {
      id: 3,
      title: 'Dual-Engine Persistence: MySQL 8.0 & SQLite Local Offline Modes',
      category: 'Technical Architecture',
      date: '10-11-2026',
      badgeColor: 'info',
      summary: 'Backend configured with environment-based dual-engine database toggle, supporting both enterprise-grade MySQL 8.0 server deployments and offline SQLite test suites.',
      audience: 'Administrators & Developers',
    },
    {
      id: 4,
      title: 'Three-Tier RBAC Access Protocol Activated',
      category: 'Security Governance',
      date: '05-11-2026',
      badgeColor: 'primary',
      summary: 'Server-side Django Group enforcement applied across all REST API endpoints for Administrator, Contracts Manager, and Safety Officer accounts with cryptographic JWT token rotation.',
      audience: 'Security & Safety Officers',
    },
  ]

  return (
    <div style={{ backgroundColor: '#F3F5F7', minHeight: '100vh' }}>
      {/* ====================================================================
          DCMA AGENCY HEADER BANNER
          ==================================================================== */}
      <section className="py-5 text-white" style={{ backgroundColor: '#0B2239', borderBottom: '3px solid #FF9933' }}>
        <div className="container py-3">
          <nav aria-label="breadcrumb" className="mb-3">
            <ol className="breadcrumb mb-0 small">
              <li className="breadcrumb-item">
                <Link to="/" className="text-white-50 text-decoration-none">
                  <i className="bi bi-house-door-fill me-1"></i>Home
                </Link>
              </li>
              <li className="breadcrumb-item active text-warning" aria-current="page">Announcements &amp; Updates</li>
            </ol>
          </nav>

          <div
            className="d-inline-flex align-items-center gap-2 px-3 py-1 rounded-1 mb-2"
            style={{ backgroundColor: 'rgba(255, 153, 51, 0.15)', border: '1px solid #FF9933' }}
          >
            <i className="bi bi-megaphone-fill text-warning"></i>
            <span className="small text-warning fw-semibold font-monospace" style={{ fontSize: '0.78rem' }}>
              OFFICIAL CIRCULARS &bull; BULLETINS &bull; POLICY DIRECTIVES
            </span>
          </div>
          <h1 className="display-5 fw-bold text-white mb-2">Announcements &amp; Updates</h1>
          <p className="lead text-white-50 mb-0 fs-6" style={{ maxWidth: '780px' }}>
            Official system notices, architecture milestones, and operational bulletins for the ContractCommand procurement platform.
          </p>
        </div>
      </section>

      {/* ====================================================================
          MAIN CONTENT
          ==================================================================== */}
      <div className="container py-5">
        <div className="row g-4 justify-content-center">
          <div className="col-lg-10">
            {/* Notice Alert */}
            <div className="alert alert-info d-flex align-items-center gap-3 mb-4 shadow-sm rounded-2" role="alert" style={{ borderLeft: '4px solid #102F53' }}>
              <i className="bi bi-info-circle-fill fs-4 text-primary"></i>
              <div className="small mb-0">
                <strong>Platform Notice:</strong> The bulletins listed below represent academic release milestones, architecture updates, and system governance notices for Project P07. They do not represent live Ministry of Defence press releases.
              </div>
            </div>

            {/* Announcement Cards */}
            <div className="d-flex flex-column gap-4">
              {announcements.map((item) => (
                <div
                  key={item.id}
                  className="card border-0 shadow-sm p-4 rounded-2 bg-white"
                  style={{ borderLeft: '4px solid #0B2239' }}
                >
                  <div className="d-flex flex-wrap justify-content-between align-items-center gap-2 mb-2 pb-2 border-bottom">
                    <div className="d-flex align-items-center gap-2">
                      <span className={`badge bg-${item.badgeColor}`}>{item.category}</span>
                      <span className="text-muted small">&bull;</span>
                      <span className="text-muted small"><i className="bi bi-calendar3 me-1"></i>{item.date}</span>
                    </div>
                    <span className="badge bg-light text-dark border small">Audience: {item.audience}</span>
                  </div>

                  <h5 className="fw-bold mb-2" style={{ color: '#0B2239' }}>
                    {item.title}
                  </h5>

                  <p className="text-muted small mb-0 lh-base">
                    {item.summary}
                  </p>
                </div>
              ))}
            </div>

            {/* Pagination / Archive Info */}
            <div className="text-center mt-5 pt-3 border-top">
              <p className="text-muted small mb-0">
                <i className="bi bi-archive me-1"></i>
                Displaying 4 active project bulletins. Historical archive logs are maintained in system documentation.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
