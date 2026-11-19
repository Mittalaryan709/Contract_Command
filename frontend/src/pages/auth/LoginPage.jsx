import { useState } from 'react'
import { useNavigate, useLocation, Link } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext.jsx'
import logoMark from '../../assets/logos/contractcommand-mark.svg'

export default function LoginPage() {
  const { login, isAuthenticated } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const from = location.state?.from?.pathname || '/app/dashboard'

  const [form, setForm] = useState({ username: '', password: '' })
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  if (isAuthenticated) {
    navigate(from, { replace: true })
    return null
  }

  const handleChange = (e) => {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }))
    if (error) setError('')
  }

  const fillDemoCredentials = (username, password) => {
    setForm({ username, password })
    if (error) setError('')
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!form.username.trim() && !form.password.trim()) {
      setError('Please provide both username and password.')
      return
    }
    if (!form.username.trim()) {
      setError('Username is required.')
      return
    }
    if (!form.password) {
      setError('Password is required.')
      return
    }

    setLoading(true)
    setError('')
    try {
      await login(form.username.trim(), form.password)
      navigate(from, { replace: true })
    } catch (err) {
      const msg =
        err.response?.data?.detail ??
        err.response?.data?.message ??
        (err.response?.status === 401
          ? 'Invalid username or password. Please verify credentials.'
          : 'Unable to connect to authentication server. Check backend status.')
      setError(msg)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={{ minHeight: 'calc(100vh - 120px)', background: '#F3F6F9', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '40px 16px' }}>
      <div style={{ width: '100%', maxWidth: 440 }}>
        {/* Header */}
        <div className="text-center mb-4">
          <img src={logoMark} alt="ContractCommand" height="54" className="mb-2" />
          <h3 className="fw-bold mb-1" style={{ color: '#102A43' }}>ContractCommand</h3>
          <p className="text-muted small mb-0">Defence Contract &amp; Procurement Management Portal</p>
        </div>

        {/* Login Card */}
        <div className="card border-0 shadow-sm p-4 p-md-5 rounded-4 bg-white">
          <div className="d-flex align-items-center justify-content-between mb-3 pb-2 border-bottom">
            <span className="fw-bold small" style={{ color: '#102A43' }}>PORTAL SIGN-IN</span>
            <span className="badge bg-secondary" style={{ fontSize: '0.7rem' }}>SECURE 256-BIT JWT</span>
          </div>

          {error && (
            <div className="alert alert-danger d-flex align-items-center gap-2 mb-3 py-2 small shadow-sm" role="alert">
              <i className="bi bi-exclamation-triangle-fill text-danger flex-shrink-0"></i>
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} noValidate>
            {/* Username */}
            <div className="mb-3">
              <label className="form-label fw-semibold small" style={{ color: '#334E68' }}>
                Username <span className="text-danger">*</span>
              </label>
              <div className="input-group">
                <span className="input-group-text bg-light border-end-0">
                  <i className="bi bi-person-badge text-muted"></i>
                </span>
                <input
                  type="text"
                  name="username"
                  className="form-control border-start-0"
                  placeholder="Enter authorized username"
                  value={form.username}
                  onChange={handleChange}
                  disabled={loading}
                  autoFocus
                />
              </div>
            </div>

            {/* Password */}
            <div className="mb-4">
              <label className="form-label fw-semibold small" style={{ color: '#334E68' }}>
                Password <span className="text-danger">*</span>
              </label>
              <div className="input-group">
                <span className="input-group-text bg-light border-end-0">
                  <i className="bi bi-lock-fill text-muted"></i>
                </span>
                <input
                  type={showPassword ? 'text' : 'password'}
                  name="password"
                  className="form-control border-start-0 border-end-0"
                  placeholder="Enter cryptographic password"
                  value={form.password}
                  onChange={handleChange}
                  disabled={loading}
                />
                <button
                  type="button"
                  className="input-group-text bg-light border-start-0"
                  onClick={() => setShowPassword(!showPassword)}
                  aria-label="Toggle password visibility"
                >
                  <i className={`bi ${showPassword ? 'bi-eye-slash' : 'bi-eye'} text-muted`}></i>
                </button>
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              className="btn btn-navy w-100 py-2 d-flex align-items-center justify-content-center gap-2 shadow-sm"
              disabled={loading}
            >
              {loading ? (
                <>
                  <span className="spinner-border spinner-border-sm" role="status"></span>
                  <span>Verifying Credentials...</span>
                </>
              ) : (
                <>
                  <i className="bi bi-shield-lock-fill text-warning"></i>
                  <span>Authenticate &amp; Enter Portal</span>
                </>
              )}
            </button>
          </form>

          {/* Demonstration Quick-Fill Pills */}
          <div className="mt-4 pt-3 border-top">
            <div className="d-flex justify-content-between align-items-center mb-2">
              <span className="text-muted small fw-semibold" style={{ fontSize: '0.75rem' }}>QUICK TEST ROLES:</span>
              <span className="text-muted" style={{ fontSize: '0.7rem' }}>Click to fill</span>
            </div>
            <div className="d-flex flex-wrap gap-1">
              <button
                type="button"
                className="btn btn-sm btn-outline-secondary py-1 px-2 small"
                style={{ fontSize: '0.72rem' }}
                onClick={() => fillDemoCredentials('admin', 'admin123')}
              >
                Administrator
              </button>
              <button
                type="button"
                className="btn btn-sm btn-outline-secondary py-1 px-2 small"
                style={{ fontSize: '0.72rem' }}
                onClick={() => fillDemoCredentials('contracts_manager', 'contracts123')}
              >
                Contracts Mgr
              </button>
              <button
                type="button"
                className="btn btn-sm btn-outline-secondary py-1 px-2 small"
                style={{ fontSize: '0.72rem' }}
                onClick={() => fillDemoCredentials('safety_officer', 'safety123')}
              >
                Safety Officer
              </button>
            </div>
          </div>
        </div>

        {/* Back to Home Link */}
        <div className="text-center mt-4">
          <Link to="/" className="text-muted small text-decoration-none">
            <i className="bi bi-arrow-left me-1"></i>Back to ContractCommand Homepage
          </Link>
        </div>
      </div>
    </div>
  )
}
