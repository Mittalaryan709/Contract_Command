import { Link } from 'react-router-dom'
import arjunTankImg from '../../assets/images/indian-army-arjun-tank.jpg'

export default function AboutPage() {
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
              <li className="breadcrumb-item active text-warning" aria-current="page">About ContractCommand</li>
            </ol>
          </nav>

          <div
            className="d-inline-flex align-items-center gap-2 px-3 py-1 rounded-1 mb-2"
            style={{ backgroundColor: 'rgba(255, 153, 51, 0.15)', border: '1px solid #FF9933' }}
          >
            <i className="bi bi-shield-check text-warning"></i>
            <span className="small text-warning fw-semibold font-monospace" style={{ fontSize: '0.78rem' }}>
              AGENCY PROFILE &bull; PROJECT P07
            </span>
          </div>
          <h1 className="display-5 fw-bold text-white mb-2">About ContractCommand</h1>
          <p className="lead text-white-50 mb-0 fs-6">
            Defence Contract and Procurement Management Platform &ndash; MCA 2nd Year Capstone Initiative.
          </p>
        </div>
      </section>

      {/* ====================================================================
          MAIN CONTENT
          ==================================================================== */}
      <div className="container py-5">
        <div className="row g-5">
          {/* Left Column: Problem & Objectives */}
          <div className="col-lg-7">
            <div className="bg-white p-4 p-md-5 rounded-2 shadow-sm mb-4">
              <div className="text-warning fw-bold text-uppercase small mb-2" style={{ letterSpacing: '1px' }}>
                Strategic Agency Overview
              </div>
              <h3 className="fw-bold mb-3" style={{ color: '#0B2239' }}>Executive Overview</h3>
              <p className="text-muted lh-base">
                <strong>ContractCommand</strong> is an enterprise-grade software platform engineered to govern the lifecycle of defence procurement, vendor relations, and contract financial operations. Built in response to the growing operational complexities in aerospace and defence logistics, the system streamlines acquisition workflows while maintaining statutory compliance under the <strong>Defence Acquisition Procedure (DAP 2020)</strong>.
              </p>
              <div className="mb-4">
                <Link to="/modules" className="btn btn-sm btn-navy px-3 py-2 d-inline-flex align-items-center gap-2 rounded-1">
                  <i className="bi bi-grid-3x3-gap-fill text-warning"></i>
                  <span>Explore the 4 Platform Modules &rarr;</span>
                </Link>
              </div>

              <div className="p-4 rounded-2 mb-4" style={{ backgroundColor: '#F3F5F7', borderLeft: '4px solid #0B2239' }}>
                <h5 className="fw-bold mb-2" style={{ color: '#0B2239' }}>The Problem Statement</h5>
                <p className="text-muted small mb-0 lh-base">
                  Legacy defence procurement operations often suffer from fragmented record-keeping across multiple disconnected tools, lack of centralized audit trails, manual vendor score calculations, and delays in multi-tier requisition approvals. ContractCommand addresses these challenges by consolidating contract records, requisition approvals, supplier evaluations, and GST payment tracking into a single unified platform.
                </p>
              </div>

              <h4 className="fw-bold mb-3" style={{ color: '#0B2239' }}>Project Objectives</h4>
              <div className="row g-3 mb-4">
                <div className="col-sm-6">
                  <div className="p-3 border rounded-2 h-100 bg-light">
                    <i className="bi bi-shield-check text-warning fs-4 mb-2 d-block"></i>
                    <h6 className="fw-bold" style={{ color: '#0B2239' }}>Auditable Governance</h6>
                    <p className="small text-muted mb-0">Ensure full traceability of every contract amendment, document upload, and requisition approval state.</p>
                  </div>
                </div>
                <div className="col-sm-6">
                  <div className="p-3 border rounded-2 h-100 bg-light">
                    <i className="bi bi-calculator text-success fs-4 mb-2 d-block"></i>
                    <h6 className="fw-bold" style={{ color: '#0B2239' }}>Deterministic Finance</h6>
                    <p className="small text-muted mb-0">Automate 18% GST line-item totals, balance reconciliations, and NEFT/RTGS transaction settlement tracking.</p>
                  </div>
                </div>
                <div className="col-sm-6">
                  <div className="p-3 border rounded-2 h-100 bg-light">
                    <i className="bi bi-star-half text-info fs-4 mb-2 d-block"></i>
                    <h6 className="fw-bold" style={{ color: '#0B2239' }}>Pillar-Based Scoring</h6>
                    <p className="small text-muted mb-0">Evaluate vendors across Quality, Delivery, Pricing, and Compliance on an objective 0&ndash;10 scale.</p>
                  </div>
                </div>
                <div className="col-sm-6">
                  <div className="p-3 border rounded-2 h-100 bg-light">
                    <i className="bi bi-lock-fill text-danger fs-4 mb-2 d-block"></i>
                    <h6 className="fw-bold" style={{ color: '#0B2239' }}>Role-Based Access Control</h6>
                    <p className="small text-muted mb-0">Server-enforced Django permissions differentiating Administrators, Contracts Managers, and Safety Officers.</p>
                  </div>
                </div>
              </div>

              <h4 className="fw-bold mb-3" style={{ color: '#0B2239' }}>Intended User Roles</h4>
              <div className="table-responsive">
                <table className="table table-bordered align-middle small mb-0">
                  <thead style={{ backgroundColor: '#0B2239', color: '#FFFFFF' }}>
                    <tr>
                      <th className="text-white">Role</th>
                      <th className="text-white">Primary Responsibilities</th>
                      <th className="text-white">System Permissions</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td className="fw-bold text-nowrap"><span className="badge bg-warning text-dark">Administrator</span></td>
                      <td>Complete platform governance, system configuration, master data oversight, and audit control.</td>
                      <td>Full CRUD permissions across all models, permanent delete authority.</td>
                    </tr>
                    <tr>
                      <td className="fw-bold text-nowrap"><span className="badge bg-info text-dark">Contracts Manager</span></td>
                      <td>Contract lifecycle management, procurement planning, vendor evaluation, and requisition approvals.</td>
                      <td>Create, view, and update records; approve/reject requisitions (no deletion).</td>
                    </tr>
                    <tr>
                      <td className="fw-bold text-nowrap"><span className="badge bg-success">Safety Officer</span></td>
                      <td>Technical equipment compliance, hazardous materials safety audit, and contract review.</td>
                      <td>Read-only access across all business modules to preserve audit integrity.</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          {/* Right Column: Tech Stack & Academic Identity */}
          <div className="col-lg-5">
            {/* Visual Callout Card */}
            <div className="card border-0 shadow-sm mb-4 rounded-2 overflow-hidden">
              <img
                src={arjunTankImg}
                alt="Main Battle Tank Arjun Mk1A - Indigenous Defence Production"
                className="img-fluid"
                style={{ height: '220px', objectFit: 'cover' }}
              />
              <div className="card-body p-3" style={{ backgroundColor: '#0B2239', color: '#fff' }}>
                <div className="small fw-bold text-warning text-uppercase" style={{ fontSize: '0.75rem', letterSpacing: '0.5px' }}>
                  Indigenous Defence Technology
                </div>
                <div className="small text-white-50">
                  Supporting DRDO, DPSUs, and Indian Armed Forces acquisition workflows under Atmanirbhar Bharat.
                </div>
              </div>
            </div>

            {/* Academic Details Card */}
            <div className="card border-0 shadow-sm mb-4 rounded-2" style={{ backgroundColor: '#0B2239', color: '#fff' }}>
              <div className="card-body p-4">
                <div className="d-flex align-items-center gap-2 mb-3">
                  <i className="bi bi-mortarboard-fill text-warning fs-3"></i>
                  <div>
                    <h5 className="fw-bold mb-0 text-white">Academic Details</h5>
                    <small className="text-white-50">HCLTech Career Shaper Companion Project</small>
                  </div>
                </div>
                <ul className="list-unstyled small d-flex flex-column gap-2 mb-0 border-top border-secondary pt-3">
                  <li className="d-flex justify-content-between"><span className="text-white-50">Project ID:</span><span className="fw-bold text-white">P07 &ndash; ContractCommand</span></li>
                  <li className="d-flex justify-content-between"><span className="text-white-50">Degree:</span><span className="fw-bold text-white">Master of Computer Applications (MCA)</span></li>
                  <li className="d-flex justify-content-between"><span className="text-white-50">Year / Semester:</span><span className="fw-bold text-white">2nd Year / 4th Semester</span></li>
                  <li className="d-flex justify-content-between"><span className="text-white-50">Institution:</span><span className="fw-bold text-white">ABES Engineering College</span></li>
                  <li className="d-flex justify-content-between"><span className="text-white-50">Corporate Partner:</span><span className="fw-bold text-warning">HCLTech</span></li>
                  <li className="d-flex justify-content-between"><span className="text-white-50">Domain:</span><span className="fw-bold text-white">Aerospace &amp; Defence Procurement</span></li>
                </ul>
              </div>
            </div>

            {/* Architecture Card */}
            <div className="card border-0 shadow-sm mb-4 rounded-2 bg-white">
              <div className="card-header py-3" style={{ backgroundColor: '#102F53', color: '#fff' }}>
                <h6 className="fw-bold mb-0 text-white">
                  <i className="bi bi-cpu me-2 text-warning"></i>
                  Enterprise Technology Stack
                </h6>
              </div>
              <div className="card-body p-3">
                <div className="d-flex flex-column gap-3 small">
                  <div className="p-2 rounded bg-light d-flex justify-content-between align-items-center">
                    <div>
                      <div className="fw-bold" style={{ color: '#0B2239' }}>Frontend Client</div>
                      <div className="text-muted" style={{ fontSize: '0.75rem' }}>React 18, Vite 6, Bootstrap 5, React Router v7</div>
                    </div>
                    <span className="badge bg-primary">SPA</span>
                  </div>

                  <div className="p-2 rounded bg-light d-flex justify-content-between align-items-center">
                    <div>
                      <div className="fw-bold" style={{ color: '#0B2239' }}>Backend Service</div>
                      <div className="text-muted" style={{ fontSize: '0.75rem' }}>Django 4.2 LTS, Django REST Framework 3.14</div>
                    </div>
                    <span className="badge bg-success">REST API</span>
                  </div>

                  <div className="p-2 rounded bg-light d-flex justify-content-between align-items-center">
                    <div>
                      <div className="fw-bold" style={{ color: '#0B2239' }}>Authentication</div>
                      <div className="text-muted" style={{ fontSize: '0.75rem' }}>SimpleJWT, 8-hour access, token rotation &amp; blacklist</div>
                    </div>
                    <span className="badge bg-warning text-dark">JWT</span>
                  </div>

                  <div className="p-2 rounded bg-light d-flex justify-content-between align-items-center">
                    <div>
                      <div className="fw-bold" style={{ color: '#0B2239' }}>Persistence &amp; DDL</div>
                      <div className="text-muted" style={{ fontSize: '0.75rem' }}>MySQL 8.0 (3NF Schema) &amp; SQLite Dual-Engine</div>
                    </div>
                    <span className="badge bg-dark">SQL</span>
                  </div>

                  <div className="p-2 rounded bg-light d-flex justify-content-between align-items-center">
                    <div>
                      <div className="fw-bold" style={{ color: '#0B2239' }}>Testing Suite</div>
                      <div className="text-muted" style={{ fontSize: '0.75rem' }}>Pytest (28/28 tests) &amp; Vitest (77/77 tests)</div>
                    </div>
                    <span className="badge bg-info text-dark">100% Pass</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Statutory Disclaimer */}
            <div className="p-3 rounded-2" style={{ backgroundColor: '#FFF8F0', border: '1px solid #FF9933' }}>
              <div className="d-flex gap-2">
                <i className="bi bi-info-circle-fill text-warning fs-5"></i>
                <div className="small text-dark">
                  <strong>Academic Prototype Notice:</strong> ContractCommand is developed strictly for educational evaluation and project demonstration purposes. It does not interface with actual military communication channels or live government transaction gateways.
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
