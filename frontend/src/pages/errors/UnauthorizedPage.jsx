import { Link } from 'react-router-dom'
export default function UnauthorizedPage() {
  return (
    <div className="d-flex flex-column align-items-center justify-content-center" style={{ minHeight: '100vh', background: '#F3F6F9' }}>
      <i className="bi bi-shield-x" style={{ fontSize: '4rem', color: '#C0392B' }}></i>
      <h1 className="mt-3" style={{ color: '#102A43' }}>403 &mdash; Access Denied</h1>
      <p className="text-muted">You do not have permission to view this page.</p>
      <Link to="/app/dashboard" className="btn mt-3" style={{ background: '#102A43', color: '#fff' }}>Return to Dashboard</Link>
    </div>
  )
}
