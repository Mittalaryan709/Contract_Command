import { Link } from 'react-router-dom'
import armyImg from '../../assets/images/army-ground.svg'
import navyImg from '../../assets/images/navy-maritime.svg'
import airForceImg from '../../assets/images/airforce-aerospace.svg'
import mfgImg from '../../assets/images/defence-manufacturing.svg'
import innovImg from '../../assets/images/indigenous-innovation.svg'

export default function LandingPage() {
  return (
    <div>
      {/* 1. HERO SECTION */}
      <section
        className="py-5 text-white position-relative"
        style={{
          background: 'linear-gradient(135deg, #0B1F33 0%, #102A43 55%, #1F3A58 100%)',
          borderBottom: '3px solid #E58A24',
        }}
      >
        <div className="container py-4 py-lg-5">
          <div className="row align-items-center g-5">
            <div className="col-lg-7">
              {/* Institutional Badge */}
              <div className="d-inline-flex align-items-center gap-2 px-3 py-1 rounded-pill mb-3" style={{ backgroundColor: 'rgba(229, 138, 36, 0.15)', border: '1px solid #E58A24' }}>
                <i className="bi bi-shield-check text-warning"></i>
                <span className="small text-white fw-semibold">P07 &bull; Defence Contract &amp; Procurement Management</span>
              </div>

              {/* Main Heading */}
              <h1 className="display-5 fw-bold mb-3 lh-sm text-white">
                Strengthening Defence Contract and <span style={{ color: '#E58A24' }}>Procurement Management</span>
              </h1>

              {/* Supporting Text */}
              <p className="lead text-white-50 mb-4 lh-base fs-6">
                ContractCommand brings contract management, procurement planning, vendor evaluation and financial tracking together in one organized platform. Designed for transparent, auditable, and resilient workflows aligned with India's Defence Acquisition Procedure (DAP 2020).
              </p>

              {/* Action Buttons */}
              <div className="d-flex flex-wrap gap-3">
                <Link to="/login" className="btn btn-saffron btn-lg px-4 py-2 d-inline-flex align-items-center gap-2 shadow">
                  <i className="bi bi-shield-lock-fill"></i>
                  <span>Access Portal</span>
                </Link>
                <Link to="/modules" className="btn btn-outline-light btn-lg px-4 py-2 d-inline-flex align-items-center gap-2">
                  <i className="bi bi-grid-3x3-gap-fill"></i>
                  <span>Explore Modules</span>
                </Link>
              </div>

              {/* Compliance Badges */}
              <div className="mt-4 pt-3 border-top border-secondary d-flex flex-wrap gap-4 text-white-50 small">
                <div className="d-flex align-items-center gap-2">
                  <i className="bi bi-check-circle-fill text-success"></i>
                  <span>DAP 2020 Aligned</span>
                </div>
                <div className="d-flex align-items-center gap-2">
                  <i className="bi bi-check-circle-fill text-success"></i>
                  <span>GST 18% Automated</span>
                </div>
                <div className="d-flex align-items-center gap-2">
                  <i className="bi bi-check-circle-fill text-success"></i>
                  <span>Role-Based JWT Security</span>
                </div>
              </div>
            </div>

            {/* Hero Visual Card */}
            <div className="col-lg-5 text-center">
              <div
                className="p-4 rounded-3 text-start shadow-lg position-relative"
                style={{
                  backgroundColor: 'rgba(16, 42, 67, 0.85)',
                  border: '1px solid rgba(229, 138, 36, 0.4)',
                  backdropFilter: 'blur(8px)',
                }}
              >
                <div className="d-flex justify-content-between align-items-center mb-3 pb-2 border-bottom border-secondary">
                  <div className="d-flex align-items-center gap-2">
                    <span className="spinner-grow spinner-grow-sm text-success" role="status"></span>
                    <span className="small text-white fw-bold">SYSTEM STATUS: ACTIVE</span>
                  </div>
                  <span className="badge bg-secondary">SECURE 256-BIT</span>
                </div>

                <div className="row g-3">
                  <div className="col-6">
                    <div className="p-3 rounded-2 text-center" style={{ backgroundColor: '#0B1F33' }}>
                      <i className="bi bi-file-earmark-lock text-warning fs-3 mb-1 d-block"></i>
                      <div className="fw-bold text-white fs-5">Active</div>
                      <div className="text-white-50" style={{ fontSize: '0.75rem' }}>Contracts Repository</div>
                    </div>
                  </div>
                  <div className="col-6">
                    <div className="p-3 rounded-2 text-center" style={{ backgroundColor: '#0B1F33' }}>
                      <i className="bi bi-diagram-3 text-info fs-3 mb-1 d-block"></i>
                      <div className="fw-bold text-white fs-5">Multi-Stage</div>
                      <div className="text-white-50" style={{ fontSize: '0.75rem' }}>Requisition Approvals</div>
                    </div>
                  </div>
                  <div className="col-6">
                    <div className="p-3 rounded-2 text-center" style={{ backgroundColor: '#0B1F33' }}>
                      <i className="bi bi-award text-success fs-3 mb-1 d-block"></i>
                      <div className="fw-bold text-white fs-5">4-Pillar</div>
                      <div className="text-white-50" style={{ fontSize: '0.75rem' }}>Vendor Evaluation</div>
                    </div>
                  </div>
                  <div className="col-6">
                    <div className="p-3 rounded-2 text-center" style={{ backgroundColor: '#0B1F33' }}>
                      <i className="bi bi-cash-coin text-warning fs-3 mb-1 d-block"></i>
                      <div className="fw-bold text-white fs-5">INR (₹)</div>
                      <div className="text-white-50" style={{ fontSize: '0.75rem' }}>NEFT/RTGS Tracking</div>
                    </div>
                  </div>
                </div>

                <div className="mt-3 p-2 rounded-2 text-center small text-white-50" style={{ backgroundColor: 'rgba(0,0,0,0.25)' }}>
                  <i className="bi bi-shield-lock me-1 text-warning"></i>
                  Restricted access to Administrator, Contracts Manager &amp; Safety Officer
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. STATS BAR */}
      <section className="py-3" style={{ backgroundColor: '#334E68' }}>
        <div className="container">
          <div className="row text-center text-white g-3">
            <div className="col-6 col-md-3">
              <div className="fs-3 fw-bold text-warning">35+</div>
              <div className="small text-white-50 text-uppercase">Active Contracts</div>
            </div>
            <div className="col-6 col-md-3">
              <div className="fs-3 fw-bold text-white">50+</div>
              <div className="small text-white-50 text-uppercase">Registered Vendors</div>
            </div>
            <div className="col-6 col-md-3">
              <div className="fs-3 fw-bold text-success">100%</div>
              <div className="small text-white-50 text-uppercase">Audit Trail Coverage</div>
            </div>
            <div className="col-6 col-md-3">
              <div className="fs-3 fw-bold text-warning">4 Core</div>
              <div className="small text-white-50 text-uppercase">Integrated Modules</div>
            </div>
          </div>
        </div>
      </section>

      {/* 3. PLATFORM MODULES SECTION */}
      <section className="py-5 bg-white">
        <div className="container py-4">
          <div className="text-center max-w-700 mx-auto mb-5">
            <div className="text-warning fw-bold text-uppercase small" style={{ letterSpacing: '1px' }}>
              Comprehensive Capabilities
            </div>
            <h2 className="fw-bold mt-2" style={{ color: '#102A43' }}>
              Four Core Management Modules
            </h2>
            <p className="text-muted">
              Structured to handle the complete defence acquisition workflow from fiscal planning to final invoice clearance.
            </p>
          </div>

          <div className="row g-4">
            {/* Card 1: Contract Management */}
            <div className="col-lg-3 col-md-6">
              <div className="module-card d-flex flex-column h-100">
                <div className="d-flex align-items-center justify-content-between mb-3">
                  <div className="rounded-3 p-3 text-white" style={{ backgroundColor: '#102A43' }}>
                    <i className="bi bi-file-earmark-text fs-4"></i>
                  </div>
                  <span className="badge bg-light text-dark border">Module 01</span>
                </div>
                <h5 className="fw-bold mb-2" style={{ color: '#102A43' }}>Contract Repository</h5>
                <p className="text-muted small flex-grow-1">
                  Manage the full lifecycle from Draft to Active, Terminated, or Completed. Enforces unique format (CC-YYYY-NNNN) and digital document attachments.
                </p>
                <Link to="/modules#contracts" className="fw-semibold text-warning text-decoration-none small mt-3 d-inline-flex align-items-center gap-1">
                  <span>Explore Module</span>
                  <i className="bi bi-arrow-right"></i>
                </Link>
              </div>
            </div>

            {/* Card 2: Procurement Management */}
            <div className="col-lg-3 col-md-6">
              <div className="module-card d-flex flex-column h-100">
                <div className="d-flex align-items-center justify-content-between mb-3">
                  <div className="rounded-3 p-3 text-white" style={{ backgroundColor: '#334E68' }}>
                    <i className="bi bi-clipboard-check fs-4"></i>
                  </div>
                  <span className="badge bg-light text-dark border">Module 02</span>
                </div>
                <h5 className="fw-bold mb-2" style={{ color: '#102A43' }}>Procurement Planning</h5>
                <p className="text-muted small flex-grow-1">
                  Fiscal year procurement plans, itemized requisitions, priority categorization, and authorized approval/rejection decision workflows.
                </p>
                <Link to="/modules#procurement" className="fw-semibold text-warning text-decoration-none small mt-3 d-inline-flex align-items-center gap-1">
                  <span>Explore Module</span>
                  <i className="bi bi-arrow-right"></i>
                </Link>
              </div>
            </div>

            {/* Card 3: Vendor Management */}
            <div className="col-lg-3 col-md-6">
              <div className="module-card d-flex flex-column h-100">
                <div className="d-flex align-items-center justify-content-between mb-3">
                  <div className="rounded-3 p-3 text-white" style={{ backgroundColor: '#287A4B' }}>
                    <i className="bi bi-building-check fs-4"></i>
                  </div>
                  <span className="badge bg-light text-dark border">Module 03</span>
                </div>
                <h5 className="fw-bold mb-2" style={{ color: '#102A43' }}>Vendor Management</h5>
                <p className="text-muted small flex-grow-1">
                  Registration of verified defence suppliers with GSTIN, PAN, and 4-pillar score evaluation (Quality, Delivery, Pricing, and Compliance).
                </p>
                <Link to="/modules#vendors" className="fw-semibold text-warning text-decoration-none small mt-3 d-inline-flex align-items-center gap-1">
                  <span>Explore Module</span>
                  <i className="bi bi-arrow-right"></i>
                </Link>
              </div>
            </div>

            {/* Card 4: Finance Management */}
            <div className="col-lg-3 col-md-6">
              <div className="module-card d-flex flex-column h-100">
                <div className="d-flex align-items-center justify-content-between mb-3">
                  <div className="rounded-3 p-3 text-white" style={{ backgroundColor: '#E58A24' }}>
                    <i className="bi bi-cash-stack fs-4"></i>
                  </div>
                  <span className="badge bg-light text-dark border">Module 04</span>
                </div>
                <h5 className="fw-bold mb-2" style={{ color: '#102A43' }}>Finance &amp; Payments</h5>
                <p className="text-muted small flex-grow-1">
                  Automated 18% GST calculation, balance reconciliation, invoice line items, and NEFT/RTGS transaction reference tracking.
                </p>
                <Link to="/modules#finance" className="fw-semibold text-warning text-decoration-none small mt-3 d-inline-flex align-items-center gap-1">
                  <span>Explore Module</span>
                  <i className="bi bi-arrow-right"></i>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 4. KEY BENEFITS SECTION */}
      <section className="py-5" style={{ backgroundColor: '#F3F6F9' }}>
        <div className="container py-4">
          <div className="row align-items-center g-5">
            <div className="col-lg-6">
              <div className="text-warning fw-bold text-uppercase small" style={{ letterSpacing: '1px' }}>
                Key Operational Benefits
              </div>
              <h2 className="fw-bold mt-2 mb-4" style={{ color: '#102A43' }}>
                Built for High-Stakes Aerospace and Defence Operations
              </h2>
              <div className="d-flex flex-column gap-3">
                <div className="d-flex gap-3 align-items-start p-3 bg-white rounded-3 shadow-sm">
                  <div className="rounded-circle p-2 text-white mt-1" style={{ backgroundColor: '#102A43' }}>
                    <i className="bi bi-database-check"></i>
                  </div>
                  <div>
                    <h6 className="fw-bold mb-1" style={{ color: '#102A43' }}>Centralized Contract Records</h6>
                    <p className="small text-muted mb-0">Eliminate data silos with unified contract profiles, document metadata, key milestone dates, and active status tracking.</p>
                  </div>
                </div>

                <div className="d-flex gap-3 align-items-start p-3 bg-white rounded-3 shadow-sm">
                  <div className="rounded-circle p-2 text-white mt-1" style={{ backgroundColor: '#334E68' }}>
                    <i className="bi bi-eye-fill"></i>
                  </div>
                  <div>
                    <h6 className="fw-bold mb-1" style={{ color: '#102A43' }}>Better Procurement Visibility</h6>
                    <p className="small text-muted mb-0">Track requisitions in real time from creation to authorized Contracts Manager review and approval decision.</p>
                  </div>
                </div>

                <div className="d-flex gap-3 align-items-start p-3 bg-white rounded-3 shadow-sm">
                  <div className="rounded-circle p-2 text-white mt-1" style={{ backgroundColor: '#287A4B' }}>
                    <i className="bi bi-graph-up-arrow"></i>
                  </div>
                  <div>
                    <h6 className="fw-bold mb-1" style={{ color: '#102A43' }}>Structured Vendor Evaluation</h6>
                    <p className="small text-muted mb-0">Mathematically calculated 0&ndash;10 average score based on Quality, Delivery, Pricing, and Statutory Compliance benchmarks.</p>
                  </div>
                </div>

                <div className="d-flex gap-3 align-items-start p-3 bg-white rounded-3 shadow-sm">
                  <div className="rounded-circle p-2 text-white mt-1" style={{ backgroundColor: '#E58A24' }}>
                    <i className="bi bi-wallet2"></i>
                  </div>
                  <div>
                    <h6 className="fw-bold mb-1" style={{ color: '#102A43' }}>Invoice &amp; Payment Reconciliation</h6>
                    <p className="small text-muted mb-0">Automatic 18% GST calculation, line item totals, real-time balance tracking, and NEFT/RTGS transaction settlement audit.</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="col-lg-6">
              <div className="p-4 p-md-5 rounded-4 text-white position-relative" style={{ backgroundColor: '#102A43', border: '1px solid #334E68' }}>
                <div className="d-flex align-items-center gap-2 mb-3">
                  <i className="bi bi-shield-shaded fs-3 text-warning"></i>
                  <h4 className="fw-bold mb-0 text-white">Three-Tier Role Security</h4>
                </div>
                <p className="text-white-50 small mb-4">
                  Every API endpoint and user action is protected with Django server-side Group permissions and JWT token verification:
                </p>

                <div className="d-flex flex-column gap-3">
                  <div className="p-3 rounded-2" style={{ backgroundColor: '#0B1F33', borderLeft: '4px solid #E58A24' }}>
                    <div className="d-flex justify-content-between align-items-center mb-1">
                      <span className="fw-bold text-white small">Administrator</span>
                      <span className="badge bg-warning text-dark">Full CRUD Access</span>
                    </div>
                    <p className="text-white-50 small mb-0">System configuration, full record creation, modification, deletion, and role administration.</p>
                  </div>

                  <div className="p-3 rounded-2" style={{ backgroundColor: '#0B1F33', borderLeft: '4px solid #334E68' }}>
                    <div className="d-flex justify-content-between align-items-center mb-1">
                      <span className="fw-bold text-white small">Contracts Manager</span>
                      <span className="badge bg-info text-dark">Management &amp; Approvals</span>
                    </div>
                    <p className="text-white-50 small mb-0">Create/update contracts, evaluate vendors, approve/reject requisitions (no permanent deletion).</p>
                  </div>

                  <div className="p-3 rounded-2" style={{ backgroundColor: '#0B1F33', borderLeft: '4px solid #287A4B' }}>
                    <div className="d-flex justify-content-between align-items-center mb-1">
                      <span className="fw-bold text-white small">Safety Officer</span>
                      <span className="badge bg-success">Read-Only Auditing</span>
                    </div>
                    <p className="text-white-50 small mb-0">Safety compliance audit, viewing technical requisitions, contract review, and inspection monitoring.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 5. INDIAN DEFENCE INNOVATION & INDIGENISATION */}
      <section className="py-5 text-white" style={{ backgroundColor: '#0B1F33', borderTop: '2px solid #334E68', borderBottom: '2px solid #334E68' }}>
        <div className="container py-4">
          <div className="text-center max-w-700 mx-auto mb-5">
            <div className="d-inline-flex align-items-center gap-2 px-3 py-1 rounded-pill mb-2" style={{ backgroundColor: 'rgba(40, 122, 75, 0.25)', border: '1px solid #287A4B' }}>
              <span className="small text-white fw-semibold">🇮🇳 Indigenous Defence Procurement Framework</span>
            </div>
            <h2 className="fw-bold mt-2 text-white">
              Supporting Atmanirbhar Bharat in Defence
            </h2>
            <p className="text-white-50">
              ContractCommand incorporates procurement categories and vendor classification indicators aligned with national defence modernization frameworks.
            </p>
          </div>

          <div className="row g-4">
            <div className="col-md-6 col-lg-3">
              <div className="p-4 rounded-3 h-100" style={{ backgroundColor: '#102A43', border: '1px solid rgba(255,255,255,0.08)' }}>
                <div className="fs-1 mb-2">📋</div>
                <h6 className="fw-bold text-warning mb-2">DAP 2020 Aligned</h6>
                <p className="small text-white-50 mb-0">
                  Follows guidelines of the Defence Acquisition Procedure 2020, emphasizing Buy (Indian-IDDM) and indigenous content compliance.
                </p>
              </div>
            </div>

            <div className="col-md-6 col-lg-3">
              <div className="p-4 rounded-3 h-100" style={{ backgroundColor: '#102A43', border: '1px solid rgba(255,255,255,0.08)' }}>
                <div className="fs-1 mb-2">🏭</div>
                <h6 className="fw-bold text-success mb-2">Make in India</h6>
                <p className="small text-white-50 mb-0">
                  Encourages domestic sourcing and vendor classification for DPSUs, MSMEs, and Indian private-sector defense manufacturers.
                </p>
              </div>
            </div>

            <div className="col-md-6 col-lg-3">
              <div className="p-4 rounded-3 h-100" style={{ backgroundColor: '#102A43', border: '1px solid rgba(255,255,255,0.08)' }}>
                <div className="fs-1 mb-2">🚀</div>
                <h6 className="fw-bold text-warning mb-2">iDEX &amp; Startups</h6>
                <p className="small text-white-50 mb-0">
                  Designed with classification tags for Innovations for Defence Excellence (iDEX) innovators, MSME suppliers, and deep tech startups.
                </p>
              </div>
            </div>

            <div className="col-md-6 col-lg-3">
              <div className="p-4 rounded-3 h-100" style={{ backgroundColor: '#102A43', border: '1px solid rgba(255,255,255,0.08)' }}>
                <div className="fs-1 mb-2">⚙️</div>
                <h6 className="fw-bold text-info mb-2">SRIJAN Initiative</h6>
                <p className="small text-white-50 mb-0">
                  Integrates indigenisation reference markers to help tracking import substitution and positive indigenisation opportunities.
                </p>
              </div>
            </div>
          </div>

          <div className="text-center mt-4 pt-2">
            <span className="small text-muted fst-italic" style={{ fontSize: '0.78rem' }}>
              Note: ContractCommand is an academic project platform. It provides reference indicators and is not officially affiliated with MoD, GoI, or GeM.
            </span>
          </div>
        </div>
      </section>

      {/* 6. DEFENCE VISUAL GALLERY */}
      <section className="py-5 bg-white">
        <div className="container py-4">
          <div className="text-center max-w-700 mx-auto mb-5">
            <div className="text-warning fw-bold text-uppercase small" style={{ letterSpacing: '1px' }}>
              Defence Operational Spheres
            </div>
            <h2 className="fw-bold mt-2" style={{ color: '#102A43' }}>
              Multi-Domain Defence Procurement Visuals
            </h2>
            <p className="text-muted">
              Covering land, maritime, aerospace, industrial manufacturing, and indigenous technology domains.
            </p>
          </div>

          <div className="row g-4 justify-content-center">
            {/* Gallery Item 1: Army */}
            <div className="col-md-6 col-lg-4">
              <div className="card border-0 shadow-sm overflow-hidden h-100">
                <img src={armyImg} alt="Land Defence Systems and Tactical Mobility" className="card-img-top" style={{ height: '200px', objectFit: 'cover' }} />
                <div className="card-body p-3">
                  <div className="d-flex justify-content-between align-items-center mb-1">
                    <h6 className="fw-bold mb-0" style={{ color: '#102A43' }}>Land Systems &amp; Tactical Mobility</h6>
                    <span className="badge bg-secondary">Army Domain</span>
                  </div>
                  <p className="text-muted small mb-0">Armoured vehicles, tactical combat gear, ammunition, and field communication systems.</p>
                </div>
              </div>
            </div>

            {/* Gallery Item 2: Navy */}
            <div className="col-md-6 col-lg-4">
              <div className="card border-0 shadow-sm overflow-hidden h-100">
                <img src={navyImg} alt="Maritime Systems and Surface Combatants" className="card-img-top" style={{ height: '200px', objectFit: 'cover' }} />
                <div className="card-body p-3">
                  <div className="d-flex justify-content-between align-items-center mb-1">
                    <h6 className="fw-bold mb-0" style={{ color: '#102A43' }}>Naval Combatants &amp; Maritime Tech</h6>
                    <span className="badge bg-secondary">Navy Domain</span>
                  </div>
                  <p className="text-muted small mb-0">Surface combatants, radar masts, sonar suites, and maritime propulsion maintenance.</p>
                </div>
              </div>
            </div>

            {/* Gallery Item 3: Air Force */}
            <div className="col-md-6 col-lg-4">
              <div className="card border-0 shadow-sm overflow-hidden h-100">
                <img src={airForceImg} alt="Aerospace and Combat Aviation Systems" className="card-img-top" style={{ height: '200px', objectFit: 'cover' }} />
                <div className="card-body p-3">
                  <div className="d-flex justify-content-between align-items-center mb-1">
                    <h6 className="fw-bold mb-0" style={{ color: '#102A43' }}>Aerospace &amp; Avionics Systems</h6>
                    <span className="badge bg-secondary">Air Force</span>
                  </div>
                  <p className="text-muted small mb-0">Indigenous fighter aircraft components, avionics line items, and ground radar equipment.</p>
                </div>
              </div>
            </div>

            {/* Gallery Item 4: Manufacturing */}
            <div className="col-md-6 col-lg-4">
              <div className="card border-0 shadow-sm overflow-hidden h-100">
                <img src={mfgImg} alt="Defence Precision Engineering and Industrial Corridors" className="card-img-top" style={{ height: '200px', objectFit: 'cover' }} />
                <div className="card-body p-3">
                  <div className="d-flex justify-content-between align-items-center mb-1">
                    <h6 className="fw-bold mb-0" style={{ color: '#102A43' }}>Precision Defence Engineering</h6>
                    <span className="badge bg-secondary">Manufacturing</span>
                  </div>
                  <p className="text-muted small mb-0">DPSU workshops, private defense industrial corridors, and CNC robotics fabrication.</p>
                </div>
              </div>
            </div>

            {/* Gallery Item 5: Innovation */}
            <div className="col-md-6 col-lg-4">
              <div className="card border-0 shadow-sm overflow-hidden h-100">
                <img src={innovImg} alt="Indigenous Technology and Deep Tech Innovation" className="card-img-top" style={{ height: '200px', objectFit: 'cover' }} />
                <div className="card-body p-3">
                  <div className="d-flex justify-content-between align-items-center mb-1">
                    <h6 className="fw-bold mb-0" style={{ color: '#102A43' }}>Indigenous Deep Tech &amp; iDEX</h6>
                    <span className="badge bg-secondary">Innovation</span>
                  </div>
                  <p className="text-muted small mb-0">Startup innovation nodes, AI surveillance, drone tech, and secure quantum networks.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 7. CTA SECTION */}
      <section
        className="py-5 text-white text-center"
        style={{
          background: 'linear-gradient(135deg, #102A43 0%, #0B1F33 100%)',
          borderTop: '3px solid #E58A24',
        }}
      >
        <div className="container py-4">
          <div className="max-w-700 mx-auto">
            <h2 className="display-6 fw-bold mb-3 text-white">Ready to Access ContractCommand?</h2>
            <p className="lead text-white-50 mb-4 fs-6">
              Authorized defence personnel, contracts managers, and safety auditors can sign in using their assigned role credentials.
            </p>
            <div className="d-flex justify-content-center gap-3">
              <Link to="/login" className="btn btn-saffron btn-lg px-4 py-2 d-inline-flex align-items-center gap-2 shadow">
                <i className="bi bi-shield-lock-fill"></i>
                <span>Sign in to Portal</span>
              </Link>
              <Link to="/about" className="btn btn-outline-light btn-lg px-4 py-2">
                <span>Learn More</span>
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
