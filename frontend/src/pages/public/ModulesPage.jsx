import { Link } from 'react-router-dom'

export default function ModulesPage() {
  return (
    <div>
      {/* Header Banner */}
      <section className="py-5 text-white" style={{ backgroundColor: '#102A43', borderBottom: '3px solid #E58A24' }}>
        <div className="container py-3">
          <div className="d-inline-flex align-items-center gap-2 px-3 py-1 rounded-pill mb-2" style={{ backgroundColor: 'rgba(229, 138, 36, 0.2)', border: '1px solid #E58A24' }}>
            <span className="small text-warning fw-semibold">Modular Enterprise Architecture</span>
          </div>
          <h1 className="display-5 fw-bold text-white mb-2">Platform Modules</h1>
          <p className="lead text-white-50 mb-0 fs-6">
            Detailed overview of the four core operational modules powering ContractCommand.
          </p>
        </div>
      </section>

      {/* Main Content */}
      <div className="container py-5">
        <div className="row g-5">

          {/* Module 1: Contract Repository */}
          <div className="col-12" id="contracts">
            <div className="p-4 p-md-5 rounded-4 bg-white shadow-sm border-start border-5" style={{ borderLeftColor: '#102A43' }}>
              <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center gap-3 mb-4 pb-3 border-bottom">
                <div className="d-flex align-items-center gap-3">
                  <div className="rounded-3 p-3 text-white" style={{ backgroundColor: '#102A43' }}>
                    <i className="bi bi-file-earmark-text fs-3"></i>
                  </div>
                  <div>
                    <span className="badge bg-secondary mb-1">Module 01</span>
                    <h3 className="fw-bold mb-0" style={{ color: '#102A43' }}>Contract Repository &amp; Lifecycle</h3>
                  </div>
                </div>
                <Link to="/login" className="btn btn-outline-dark btn-sm px-3 py-2 d-inline-flex align-items-center gap-2">
                  <span>Sign in to access contracts</span>
                  <i className="bi bi-arrow-right"></i>
                </Link>
              </div>

              <div className="row g-4">
                <div className="col-lg-6">
                  <h6 className="fw-bold" style={{ color: '#102A43' }}>Core Objectives</h6>
                  <p className="text-muted small lh-base">
                    The Contract Repository module provides end-to-end visibility and lifecycle governance over defence contracts. Each agreement is tracked with standard numbering (CC-YYYY-NNNN), verified supplier linkage, and comprehensive financial valuation in Indian Rupees (₹).
                  </p>

                  <h6 className="fw-bold mt-3" style={{ color: '#102A43' }}>Contract Status Workflow</h6>
                  <div className="d-flex flex-wrap gap-2 mt-2">
                    <span className="badge bg-secondary">Draft</span>
                    <i className="bi bi-arrow-right text-muted small align-self-center"></i>
                    <span className="badge bg-success">Active</span>
                    <i className="bi bi-arrow-right text-muted small align-self-center"></i>
                    <span className="badge bg-primary">Completed</span>
                    <span className="badge bg-danger ms-2">Expired</span>
                    <span className="badge bg-warning text-dark">Terminated</span>
                  </div>
                </div>

                <div className="col-lg-6">
                  <h6 className="fw-bold" style={{ color: '#102A43' }}>Key Capabilities</h6>
                  <ul className="list-unstyled small text-muted d-flex flex-column gap-2 mb-0">
                    <li className="d-flex gap-2">
                      <i className="bi bi-check-circle-fill text-success"></i>
                      <span><strong>Contract Records:</strong> Categorized by Supply, Service, Maintenance, Research, or Consulting.</span>
                    </li>
                    <li className="d-flex gap-2">
                      <i className="bi bi-check-circle-fill text-success"></i>
                      <span><strong>Document Metadata:</strong> Associate digital attachments, signed PDF references, and amendments.</span>
                    </li>
                    <li className="d-flex gap-2">
                      <i className="bi bi-check-circle-fill text-success"></i>
                      <span><strong>Chronological Validation:</strong> Strict database constraints preventing end dates preceding start dates.</span>
                    </li>
                    <li className="d-flex gap-2">
                      <i className="bi bi-check-circle-fill text-success"></i>
                      <span><strong>Search &amp; Filters:</strong> Instant full-text search by contract number, title, description, or vendor.</span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>

          {/* Module 2: Procurement Planning */}
          <div className="col-12" id="procurement">
            <div className="p-4 p-md-5 rounded-4 bg-white shadow-sm border-start border-5" style={{ borderLeftColor: '#334E68' }}>
              <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center gap-3 mb-4 pb-3 border-bottom">
                <div className="d-flex align-items-center gap-3">
                  <div className="rounded-3 p-3 text-white" style={{ backgroundColor: '#334E68' }}>
                    <i className="bi bi-clipboard-check fs-3"></i>
                  </div>
                  <div>
                    <span className="badge bg-secondary mb-1">Module 02</span>
                    <h3 className="fw-bold mb-0" style={{ color: '#102A43' }}>Procurement Planning &amp; Requisitions</h3>
                  </div>
                </div>
                <Link to="/login" className="btn btn-outline-dark btn-sm px-3 py-2 d-inline-flex align-items-center gap-2">
                  <span>Sign in to manage requisitions</span>
                  <i className="bi bi-arrow-right"></i>
                </Link>
              </div>

              <div className="row g-4">
                <div className="col-lg-6">
                  <h6 className="fw-bold" style={{ color: '#102A43' }}>Core Objectives</h6>
                  <p className="text-muted small lh-base">
                    Organize defence equipment procurement around annual fiscal plans. Stakeholders submit line-item requisitions detailing quantity, unit prices, and required delivery deadlines, feeding into multi-tier approval gates.
                  </p>

                  <h6 className="fw-bold mt-3" style={{ color: '#102A43' }}>Priority Levels</h6>
                  <div className="d-flex flex-wrap gap-2 mt-2">
                    <span className="badge bg-secondary">Low</span>
                    <span className="badge bg-info text-dark">Medium</span>
                    <span className="badge bg-warning text-dark">High</span>
                    <span className="badge bg-danger">Urgent</span>
                  </div>
                </div>

                <div className="col-lg-6">
                  <h6 className="fw-bold" style={{ color: '#102A43' }}>Key Capabilities</h6>
                  <ul className="list-unstyled small text-muted d-flex flex-column gap-2 mb-0">
                    <li className="d-flex gap-2">
                      <i className="bi bi-check-circle-fill text-success"></i>
                      <span><strong>Procurement Plans:</strong> Track annual budgets (e.g. FY 2024-2025) and requisition allocations.</span>
                    </li>
                    <li className="d-flex gap-2">
                      <i className="bi bi-check-circle-fill text-success"></i>
                      <span><strong>Itemized Requisitions:</strong> Line items with quantity, unit of measurement, unit price, and auto-computed line total.</span>
                    </li>
                    <li className="d-flex gap-2">
                      <i className="bi bi-check-circle-fill text-success"></i>
                      <span><strong>Approval Decision Workflow:</strong> Custom actions for Contracts Managers and Admins to approve or reject requests.</span>
                    </li>
                    <li className="d-flex gap-2">
                      <i className="bi bi-check-circle-fill text-success"></i>
                      <span><strong>Audit Timestamps:</strong> Automated recording of approving user and precise timestamp for every decision.</span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>

          {/* Module 3: Vendor Management */}
          <div className="col-12" id="vendors">
            <div className="p-4 p-md-5 rounded-4 bg-white shadow-sm border-start border-5" style={{ borderLeftColor: '#287A4B' }}>
              <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center gap-3 mb-4 pb-3 border-bottom">
                <div className="d-flex align-items-center gap-3">
                  <div className="rounded-3 p-3 text-white" style={{ backgroundColor: '#287A4B' }}>
                    <i className="bi bi-building-check fs-3"></i>
                  </div>
                  <div>
                    <span className="badge bg-secondary mb-1">Module 03</span>
                    <h3 className="fw-bold mb-0" style={{ color: '#102A43' }}>Vendor Evaluation &amp; Selection</h3>
                  </div>
                </div>
                <Link to="/login" className="btn btn-outline-dark btn-sm px-3 py-2 d-inline-flex align-items-center gap-2">
                  <span>Sign in to view vendors</span>
                  <i className="bi bi-arrow-right"></i>
                </Link>
              </div>

              <div className="row g-4">
                <div className="col-lg-6">
                  <h6 className="fw-bold" style={{ color: '#102A43' }}>Core Objectives</h6>
                  <p className="text-muted small lh-base">
                    Maintains the master repository of approved defence contractors, MSMEs, DPSUs, and private manufacturers. Includes statutory tax identity compliance (GSTIN, PAN) and rigorous objective evaluation scoring.
                  </p>

                  <h6 className="fw-bold mt-3" style={{ color: '#102A43' }}>4-Pillar Evaluation Framework</h6>
                  <div className="row g-2 mt-1">
                    <div className="col-6"><span className="badge bg-light text-dark border w-100 py-2">Quality Score (0&ndash;10)</span></div>
                    <div className="col-6"><span className="badge bg-light text-dark border w-100 py-2">Delivery Score (0&ndash;10)</span></div>
                    <div className="col-6"><span className="badge bg-light text-dark border w-100 py-2">Pricing Score (0&ndash;10)</span></div>
                    <div className="col-6"><span className="badge bg-light text-dark border w-100 py-2">Compliance Score (0&ndash;10)</span></div>
                  </div>
                </div>

                <div className="col-lg-6">
                  <h6 className="fw-bold" style={{ color: '#102A43' }}>Key Capabilities</h6>
                  <ul className="list-unstyled small text-muted d-flex flex-column gap-2 mb-0">
                    <li className="d-flex gap-2">
                      <i className="bi bi-check-circle-fill text-success"></i>
                      <span><strong>Indian Vendor Profiles:</strong> Validated Indian 10-digit phone numbers, GSTIN format, PAN, and full state/city directory.</span>
                    </li>
                    <li className="d-flex gap-2">
                      <i className="bi bi-check-circle-fill text-success"></i>
                      <span><strong>Automated Score Calculation:</strong> Automatic server-side calculation of overall score as the exact average of 4 pillars.</span>
                    </li>
                    <li className="d-flex gap-2">
                      <i className="bi bi-check-circle-fill text-success"></i>
                      <span><strong>Selection Recommendations:</strong> Formal outcomes tagged as Selected, Shortlisted, or Rejected.</span>
                    </li>
                    <li className="d-flex gap-2">
                      <i className="bi bi-check-circle-fill text-success"></i>
                      <span><strong>Vendor Comparison:</strong> Side-by-side performance score benchmarking across competing tender candidates.</span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>

          {/* Module 4: Finance Management */}
          <div className="col-12" id="finance">
            <div className="p-4 p-md-5 rounded-4 bg-white shadow-sm border-start border-5" style={{ borderLeftColor: '#E58A24' }}>
              <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center gap-3 mb-4 pb-3 border-bottom">
                <div className="d-flex align-items-center gap-3">
                  <div className="rounded-3 p-3 text-white" style={{ backgroundColor: '#E58A24' }}>
                    <i className="bi bi-cash-stack fs-3"></i>
                  </div>
                  <div>
                    <span className="badge bg-secondary mb-1">Module 04</span>
                    <h3 className="fw-bold mb-0" style={{ color: '#102A43' }}>Invoice &amp; Payment Processing</h3>
                  </div>
                </div>
                <Link to="/login" className="btn btn-outline-dark btn-sm px-3 py-2 d-inline-flex align-items-center gap-2">
                  <span>Sign in to view finance</span>
                  <i className="bi bi-arrow-right"></i>
                </Link>
              </div>

              <div className="row g-4">
                <div className="col-lg-6">
                  <h6 className="fw-bold" style={{ color: '#102A43' }}>Core Objectives</h6>
                  <p className="text-muted small lh-base">
                    Ensures strict fiscal accountability for defence disbursements. Invoices are linked to contracts, verified with line items, taxed at 18% GST, and balanced against recorded NEFT, RTGS, or IMPS settlement references.
                  </p>

                  <h6 className="fw-bold mt-3" style={{ color: '#102A43' }}>Supported Payment Methods</h6>
                  <div className="d-flex flex-wrap gap-2 mt-2">
                    <span className="badge bg-dark">NEFT</span>
                    <span className="badge bg-dark">RTGS</span>
                    <span className="badge bg-dark">IMPS</span>
                    <span className="badge bg-secondary">Cheque</span>
                    <span className="badge bg-secondary">Demand Draft</span>
                  </div>
                </div>

                <div className="col-lg-6">
                  <h6 className="fw-bold" style={{ color: '#102A43' }}>Key Capabilities</h6>
                  <ul className="list-unstyled small text-muted d-flex flex-column gap-2 mb-0">
                    <li className="d-flex gap-2">
                      <i className="bi bi-check-circle-fill text-success"></i>
                      <span><strong>Standard Numbering:</strong> INV-YYYY-NNNNN invoice schema linked to specific contracts and vendors.</span>
                    </li>
                    <li className="d-flex gap-2">
                      <i className="bi bi-check-circle-fill text-success"></i>
                      <span><strong>Automated Tax Calculation:</strong> Server-side 18% GST calculation on line item subtotals.</span>
                    </li>
                    <li className="d-flex gap-2">
                      <i className="bi bi-check-circle-fill text-success"></i>
                      <span><strong>Balance Reconciliation:</strong> Dynamically computed paid amount and outstanding balance per invoice.</span>
                    </li>
                    <li className="d-flex gap-2">
                      <i className="bi bi-check-circle-fill text-success"></i>
                      <span><strong>Payment Audits:</strong> Complete payment status tracking (Initiated, Processing, Completed, Failed, Reversed).</span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  )
}
