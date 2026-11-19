import { Link } from 'react-router-dom'
import logoMark from '../../assets/logos/contractcommand-mark.svg'

export default function NotFoundPage() {
  return (
    <div
      className="d-flex flex-column align-items-center justify-content-center px-3"
      style={{ minHeight: '100vh', backgroundColor: '#F3F6F9' }}
    >
      <div className="text-center p-5 bg-white rounded-4 shadow-sm" style={{ maxWidth: '520px', borderTop: '4px solid #F18A00' }}>
        <img src={logoMark} alt="ContractCommand Logo" height="52" className="mb-3" />
        <div className="d-inline-flex align-items-center gap-2 px-3 py-1 rounded-pill mb-3 bg-warning bg-opacity-10 text-dark border border-warning">
          <i className="bi bi-compass-fill text-warning"></i>
          <span className="small fw-bold">HTTP 404 &bull; SECURE RESOURCE NOT FOUND</span>
        </div>
        <h3 className="fw-bold mb-2" style={{ color: '#102A43' }}>Page Not Found</h3>
        <p className="text-muted small mb-4 lh-base">
          The tactical resource, contract ledger route, or requested interface cannot be resolved within the ContractCommand secure domain.
        </p>

        <div className="d-flex justify-content-center gap-3">
          <Link to="/app/dashboard" className="btn btn-navy px-4 py-2 small fw-semibold">
            <i className="bi bi-speedometer2 me-1"></i>To Dashboard
          </Link>
          <Link to="/" className="btn btn-outline-secondary px-3 py-2 small">
            <i className="bi bi-house-door me-1"></i>Public Portal
          </Link>
        </div>
      </div>
    </div>
  )
}
