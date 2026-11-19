import { Link } from 'react-router-dom'

export default function AboutPage() {
  return (
    <div>
      {/* Header Banner */}
      <section className="py-5 text-white" style={{ backgroundColor: '#102A43', borderBottom: '3px solid #E58A24' }}>
        <div className="container py-3">
          <div className="d-inline-flex align-items-center gap-2 px-3 py-1 rounded-pill mb-2" style={{ backgroundColor: 'rgba(229, 138, 36, 0.2)', border: '1px solid #E58A24' }}>
            <span className="small text-warning fw-semibold">Academic Companion Project P07</span>
          </div>
          <h1 className="display-5 fw-bold text-white mb-2">About ContractCommand</h1>
          <p className="lead text-white-50 mb-0 fs-6">
            Defence Contract and Procurement Management Platform &ndash; MCA 2nd Year Capstone Initiative.
          </p>
        </div>
      </section>

      {/* Main Content */}
      <div className="container py-5">
        <div className="row g-5">
          {/* Left Column: Problem & Objectives */}
          <div className="col-lg-7">
            <h3 className="fw-bold mb-3" style={{ color: '#102A43' }}>Executive Overview</h3>
            <p className="text-muted lh-base">
              <strong>ContractCommand</strong> is a modern, enterprise-grade software platform designed to manage the lifecycle of defence procurement, vendor relations, and contract financial operations. Built in response to the growing operational complexities in aerospace and defence logistics, the system streamlines acquisition workflows while maintaining statutory compliance.
            </p>
            <div className="mb-4">
              <Link to="/modules" className="btn btn-sm btn-outline-dark px-3 py-2 d-inline-flex align-items-center gap-2">
                <i className="bi bi-grid-3x3-gap-fill text-warning"></i>
                <span>Explore the 4 Platform Modules &rarr;</span>
              </Link>
            </div>

            <div className="p-4 rounded-3 mb-4" style={{ backgroundColor: '#F3F6F9', borderLeft: '4px solid #102A43' }}>
              <h5 className="fw-bold mb-2" style={{ color: '#102A43' }}>The Problem Statement</h5>
              <p className="text-muted small mb-0 lh-base">
                Legacy defence procurement operations often suffer from fragmented record-keeping across multiple disconnected tools, lack of centralized audit trails, manual vendor score calculations, and delays in multi-tier requisition approvals. ContractCommand addresses these challenges by consolidating contract records, requisition approvals, supplier evaluations, and GST payment tracking into a single unified platform.
              </p>
            </div>

            <h4 className="fw-bold mb-3" style={{ color: '#102A43' }}>Project Objectives</h4>
            <div className="row g-3 mb-4">
              <div className="col-sm-6">
                <div className="p-3 border rounded-3 h-100 bg-white shadow-sm">
                  <i className="bi bi-shield-check text-warning fs-4 mb-2 d-block"></i>
                  <h6 className="fw-bold" style={{ color: '#102A43' }}>Auditable Governance</h6>
                  <p className="small text-muted mb-0">Ensure full traceability of every contract amendment, document upload, and requisition approval state.</p>
                </div>
              </div>
              <div className="col-sm-6">
                <div className="p-3 border rounded-3 h-100 bg-white shadow-sm">
                  <i className="bi bi-calculator text-success fs-4 mb-2 d-block"></i>
                  <h6 className="fw-bold" style={{ color: '#102A43' }}>Deterministic Finance</h6>
                  <p className="small text-muted mb-0">Automate 18% GST line-item totals, balance reconciliations, and NEFT/RTGS transaction settlement tracking.</p>
                </div>
              </div>
              <div className="col-sm-6">
                <div className="p-3 border rounded-3 h-100 bg-white shadow-sm">
                  <i className="bi bi-star-half text-info fs-4 mb-2 d-block"></i>
                  <h6 className="fw-bold" style={{ color: '#102A43' }}>Pillar-Based Scoring</h6>
                  <p className="small text-muted mb-0">Evaluate vendors across Quality, Delivery, Pricing, and Compliance on an objective 0&ndash;10 scale.</p>
                </div>
              </div>
              <div className="col-sm-6">
                <div className="p-3 border rounded-3 h-100 bg-white shadow-sm">
                  <i className="bi bi-lock-fill text-danger fs-4 mb-2 d-block"></i>
                  <h6 className="fw-bold" style={{ color: '#102A43' }}>Role-Based Access Control</h6>
                  <p className="small text-muted mb-0">Server-enforced Django permissions differentiating Administrators, Contracts Managers, and Safety Officers.</p>
                </div>
              </div>
            </div>

            <h4 className="fw-bold mb-3" style={{ color: '#102A43' }}>Intended User Roles</h4>
            <div className="table-responsive">
              <table className="table table-bordered align-middle small">
                <thead style={{ backgroundColor: '#F3F6F9' }}>
                  <tr>
                    <th style={{ color: '#102A43' }}>Role</th>
                    <th style={{ color: '#102A43' }}>Primary Responsibilities</th>
                    <th style={{ color: '#102A43' }}>System Permissions</th>
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

          {/* Right Column: Tech Stack & Academic Identity */}
          <div className="col-lg-5">
            {/* Academic Details Card */}
            <div className="card border-0 shadow-sm mb-4" style={{ backgroundColor: '#0B1F33', color: '#fff' }}>
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
            <div className="card border-0 shadow-sm mb-4">
              <div className="card-header bg-white py-3">
                <h6 className="fw-bold mb-0" style={{ color: '#102A43' }}>Enterprise Technology Stack</h6>
              </div>
              <div className="card-body p-3">
                <div className="d-flex flex-column gap-3 small">
                  <div className="p-2 rounded bg-light d-flex justify-content-between align-items-center">
                    <div>
                      <div className="fw-bold" style={{ color: '#102A43' }}>Frontend Client</div>
                      <div className="text-muted" style={{ fontSize: '0.75rem' }}>React 18, Vite 6, Bootstrap 5, React Router v7</div>
                    </div>
                    <span className="badge bg-primary">SPA</span>
                  </div>

                  <div className="p-2 rounded bg-light d-flex justify-content-between align-items-center">
                    <div>
                      <div className="fw-bold" style={{ color: '#102A43' }}>Backend Service</div>
                      <div className="text-muted" style={{ fontSize: '0.75rem' }}>Django 4.2 LTS, Django REST Framework 3.14</div>
                    </div>
                    <span className="badge bg-success">REST API</span>
                  </div>

                  <div className="p-2 rounded bg-light d-flex justify-content-between align-items-center">
                    <div>
                      <div className="fw-bold" style={{ color: '#102A43' }}>Authentication</div>
                      <div className="text-muted" style={{ fontSize: '0.75rem' }}>SimpleJWT, 8-hour access, token rotation &amp; blacklist</div>
                    </div>
                    <span className="badge bg-warning text-dark">JWT</span>
                  </div>

                  <div className="p-2 rounded bg-light d-flex justify-content-between align-items-center">
                    <div>
                      <div className="fw-bold" style={{ color: '#102A43' }}>Persistence &amp; DDL</div>
                      <div className="text-muted" style={{ fontSize: '0.75rem' }}>MySQL 8.0 (3NF Schema) &amp; SQLite Dual-Engine</div>
                    </div>
                    <span className="badge bg-dark">SQL</span>
                  </div>

                  <div className="p-2 rounded bg-light d-flex justify-content-between align-items-center">
                    <div>
                      <div className="fw-bold" style={{ color: '#102A43' }}>Testing Suite</div>
                      <div className="text-muted" style={{ fontSize: '0.75rem' }}>Pytest (28/28 tests) &amp; Vitest (13/13 tests)</div>
                    </div>
                    <span className="badge bg-info text-dark">100% Pass</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Statutory Disclaimer */}
            <div className="p-3 rounded-3" style={{ backgroundColor: '#FFF8F0', border: '1px solid #E58A24' }}>
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
