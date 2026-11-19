import { Link } from 'react-router-dom'
import logoMark from '../../assets/logos/contractcommand-mark.svg'

export default function UnauthorizedPage() {
  return (
    <div
      className="d-flex flex-column align-items-center justify-content-center px-3"
      style={{ minHeight: '100vh', backgroundColor: '#F3F6F9' }}
    >
      <div className="text-center p-5 bg-white rounded-4 shadow-sm" style={{ maxWidth: '520px', borderTop: '4px solid #C0392B' }}>
        <img src={logoMark} alt="Logo" height="52" className="mb-3" />
        <div className="d-inline-flex align-items-center gap-2 px-3 py-1 rounded-pill mb-3 bg-danger bg-opacity-10 text-danger border border-danger">
          <i className="bi bi-shield-slash-fill"></i>
          <span className="small fw-bold">HTTP 403 &bull; SECURITY ACCESS DENIED</span>
        </div>
        <h3 className="fw-bold mb-2" style={{ color: '#102A43' }}>Access Restricted</h3>
        <p className="text-muted small mb-4 lh-base">
          Your current authenticated role does not possess the requisite clearance or write permissions for this resource. To maintain auditable governance, unauthorized actions are blocked by Django server-side role policies.
        </p>

        <div className="p-3 rounded-2 text-start small mb-4" style={{ backgroundColor: '#F3F6F9', border: '1px solid #DEE2E6' }}>
          <div className="fw-bold text-dark mb-1">Standard Role Hierarchy:</div>
          <ul className="list-unstyled mb-0 text-muted" style={{ fontSize: '0.78rem' }}>
            <li>&bull; <strong>Administrator:</strong> Full access to all business modules and deletion</li>
            <li>&bull; <strong>Contracts Manager:</strong> Manage &amp; approve contracts/procurement</li>
            <li>&bull; <strong>Safety Officer:</strong> Read-only audit inspection views</li>
          </ul>
        </div>

        <div className="d-flex justify-content-center gap-3">
          <Link to="/app/dashboard" className="btn btn-navy px-4 py-2 small fw-semibold">
            <i className="bi bi-speedometer2 me-1"></i>Return to Dashboard
          </Link>
          <Link to="/" className="btn btn-outline-secondary px-3 py-2 small">
            Home
          </Link>
        </div>
      </div>
    </div>
  )
}
