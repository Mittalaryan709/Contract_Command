import { Link, Outlet, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext.jsx'

export default function PublicLayout() {
  const { isAuthenticated } = useAuth()
  const navigate = useNavigate()
  return (
    <div>
      {/* Tricolour bar */}
      <div className="tricolour-bar">
        <div className="tricolour-saffron" />
        <div className="tricolour-white" />
        <div className="tricolour-green" />
      </div>
      {/* Navbar */}
      <nav className="navbar navbar-expand-lg navbar-dark" style={{ background: '#102A43' }}>
        <div className="container">
          <Link className="navbar-brand d-flex align-items-center gap-2 fw-bold" to="/">
            <i className="bi bi-shield-fill-check fs-4" style={{ color: '#E58A24' }}></i>
            ContractCommand
          </Link>
          <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#publicNav">
            <span className="navbar-toggler-icon" />
          </button>
          <div className="collapse navbar-collapse" id="publicNav">
            <ul className="navbar-nav ms-auto me-4">
              <li className="nav-item"><Link className="nav-link" to="/">Home</Link></li>
              <li className="nav-item"><Link className="nav-link" to="/about">About</Link></li>
              <li className="nav-item"><Link className="nav-link" to="/contact">Contact</Link></li>
            </ul>
            {isAuthenticated
              ? <button className="btn btn-sm" style={{ background: '#E58A24', color: '#fff' }} onClick={() => navigate('/app/dashboard')}>Dashboard</button>
              : <Link to="/login" className="btn btn-sm" style={{ background: '#E58A24', color: '#fff' }}>Login</Link>}
          </div>
        </div>
      </nav>
      <Outlet />
      {/* Footer */}
      <footer style={{ background: '#0B1F33', color: 'rgba(255,255,255,.7)', padding: '32px 0' }}>
        <div className="container">
          <div className="row">
            <div className="col-md-4 mb-3">
              <div className="d-flex align-items-center gap-2 mb-2">
                <i className="bi bi-shield-fill-check fs-5" style={{ color: '#E58A24' }}></i>
                <strong className="text-white">ContractCommand</strong>
              </div>
              <small>Defence Contract &amp; Procurement Management Platform</small>
            </div>
            <div className="col-md-4 mb-3">
              <strong className="text-white d-block mb-2">Academic Project</strong>
              <small>P07 &ndash; HCLTech Career Shaper<br />MCA 2nd Year, ABES Engineering College</small>
            </div>
            <div className="col-md-4 mb-3">
              <strong className="text-white d-block mb-2">Disclaimer</strong>
              <small>This is an academic project. Not affiliated with the Ministry of Defence or Government of India.</small>
            </div>
          </div>
          <hr style={{ borderColor: 'rgba(255,255,255,.15)' }} />
          <div className="text-center"><small>&copy; 2024 ContractCommand | MCA P07 Project | ABES Engineering College</small></div>
        </div>
      </footer>
    </div>
  )
}
