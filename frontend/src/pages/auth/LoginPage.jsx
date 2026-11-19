import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext.jsx'

export default function LoginPage() {
  const { login, isAuthenticated } = useAuth()
  const navigate = useNavigate()
  const [form, setForm] = useState({ username: '', password: '' })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  if (isAuthenticated) { navigate('/app/dashboard'); return null }

  const handleChange = e => setForm(p => ({ ...p, [e.target.name]: e.target.value }))

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!form.username || !form.password) { setError('Please enter username and password.'); return }
    setLoading(true); setError('')
    try {
      await login(form.username, form.password)
      navigate('/app/dashboard')
    } catch (err) {
      const msg = err.response?.data?.detail ?? err.response?.data?.message ?? 'Invalid credentials. Please try again.'
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
          <div style={{ width: 64, height: 64, background: '#102A43', borderRadius: '16px', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px' }}>
            <i className="bi bi-shield-fill-check" style={{ fontSize: '2rem', color: '#E58A24' }}></i>
          </div>
          <h2 style={{ color: '#102A43', fontWeight: 800 }}>ContractCommand</h2>
          <p style={{ color: '#627D98' }}>Secure Portal Access</p>
        </div>

        {/* Card */}
        <div style={{ background: '#fff', borderRadius: '16px', padding: '36px', boxShadow: '0 4px 24px rgba(0,0,0,.1)' }}>
          {error && (
            <div className="alert alert-danger d-flex align-items-center gap-2 mb-4" role="alert">
              <i className="bi bi-exclamation-triangle-fill"></i>
              <span style={{ fontSize: '.9rem' }}>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <div className="mb-3">
              <label className="form-label fw-semibold" style={{ color: '#334E68' }}>Username</label>
              <div className="input-group">
                <span className="input-group-text" style={{ background: '#F3F6F9', border: '1px solid #dee2e6' }}>
                  <i className="bi bi-person" style={{ color: '#627D98' }}></i>
                </span>
                <input
                  type="text" name="username" className="form-control" placeholder="Enter your username"
                  value={form.username} onChange={handleChange} disabled={loading} autoFocus
                  style={{ borderLeft: 'none' }}
                />
              </div>
            </div>
            <div className="mb-4">
              <label className="form-label fw-semibold" style={{ color: '#334E68' }}>Password</label>
              <div className="input-group">
                <span className="input-group-text" style={{ background: '#F3F6F9', border: '1px solid #dee2e6' }}>
                  <i className="bi bi-lock" style={{ color: '#627D98' }}></i>
                </span>
                <input
                  type="password" name="password" className="form-control" placeholder="Enter your password"
                  value={form.password} onChange={handleChange} disabled={loading}
                  style={{ borderLeft: 'none' }}
                />
              </div>
            </div>
            <button
              type="submit" className="btn w-100" disabled={loading}
              style={{ background: '#102A43', color: '#fff', padding: '12px', borderRadius: '8px', fontWeight: 700, fontSize: '1rem' }}
            >
              {loading
                ? <><span className="spinner-border spinner-border-sm me-2" />Signing In...</>
                : <><i className="bi bi-shield-lock me-2"></i>Sign In</>
              }
            </button>
          </form>

          <div className="mt-4 p-3" style={{ background: '#F3F6F9', borderRadius: '8px' }}>
            <small style={{ color: '#627D98' }}>
              <i className="bi bi-info-circle me-1"></i>
              <strong>Demo credentials:</strong> Use an admin account created via Django admin panel or manage.py createsuperuser.
            </small>
          </div>
        </div>

        <div className="text-center mt-4">
          <Link to="/" style={{ color: '#627D98', fontSize: '.85rem', textDecoration: 'none' }}>
            <i className="bi bi-arrow-left me-1"></i>Back to Home
          </Link>
        </div>
      </div>
    </div>
  )
}
