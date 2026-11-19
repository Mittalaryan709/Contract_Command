import { useState } from 'react'
import { useAuth } from '../../context/AuthContext.jsx'
import { updateProfile, changePassword } from '../../api/authApi.js'

export default function ProfilePage() {
  const { user, refreshUser } = useAuth()
  const [editing, setEditing] = useState(false)
  const [form, setForm] = useState({
    first_name: user?.first_name || '',
    last_name: user?.last_name || '',
    email: user?.email || '',
    phone: user?.profile?.phone || '',
    department: user?.profile?.department || '',
    city: user?.profile?.city || '',
  })

  const [pwForm, setPwForm] = useState({
    old_password: '',
    new_password: '',
    confirm_password: '',
  })

  const [profileMsg, setProfileMsg] = useState('')
  const [profileErr, setProfileErr] = useState('')
  const [pwMsg, setPwMsg] = useState('')
  const [pwErr, setPwErr] = useState('')
  const [profileLoading, setProfileLoading] = useState(false)
  const [pwLoading, setPwLoading] = useState(false)

  const handleProfileSave = async (e) => {
    e.preventDefault()
    setProfileLoading(true)
    setProfileMsg('')
    setProfileErr('')
    try {
      await updateProfile(form)
      await refreshUser?.()
      setProfileMsg('User profile updated successfully.')
      setEditing(false)
    } catch (err) {
      setProfileErr(err.response?.data?.message || 'Failed to update profile information.')
    } finally {
      setProfileLoading(false)
    }
  }

  const handlePasswordSubmit = async (e) => {
    e.preventDefault()
    setPwMsg('')
    setPwErr('')

    if (!pwForm.old_password || !pwForm.new_password || !pwForm.confirm_password) {
      setPwErr('All password fields are required.')
      return
    }
    if (pwForm.new_password.length < 8) {
      setPwErr('New password must be at least 8 characters long.')
      return
    }
    if (pwForm.new_password !== pwForm.confirm_password) {
      setPwErr('New password and confirmation do not match.')
      return
    }

    setPwLoading(true)
    try {
      await changePassword({
        old_password: pwForm.old_password,
        new_password: pwForm.new_password,
      })
      setPwMsg('Password updated successfully. Use new password for next sign-in.')
      setPwForm({ old_password: '', new_password: '', confirm_password: '' })
    } catch (err) {
      setPwErr(err.response?.data?.message || err.response?.data?.errors?.old_password?.[0] || 'Current password is incorrect.')
    } finally {
      setPwLoading(false)
    }
  }

  return (
    <div>
      {/* Page Title & User Header */}
      <div className="d-flex flex-column flex-sm-row justify-content-between align-items-sm-center gap-3 mb-4 pb-3 border-bottom">
        <div className="d-flex align-items-center gap-3">
          <div
            style={{
              width: 54,
              height: 54,
              borderRadius: '50%',
              backgroundColor: '#102A43',
              color: '#E58A24',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontWeight: 800,
              fontSize: '1.4rem',
              border: '2px solid #E58A24',
            }}
          >
            {user?.first_name?.[0] ?? user?.username?.[0] ?? 'U'}
          </div>
          <div>
            <h4 className="fw-bold mb-1" style={{ color: '#102A43' }}>
              {user?.full_name || user?.username}
            </h4>
            <div className="d-flex align-items-center gap-2">
              <span className="badge bg-warning text-dark">{user?.groups?.[0] || 'Authenticated Staff'}</span>
              <span className="text-muted small">&bull;</span>
              <span className="text-muted small">{user?.profile?.department || 'Defence Management Division'}</span>
            </div>
          </div>
        </div>
      </div>

      <div className="row g-4">
        {/* Profile Card */}
        <div className="col-lg-7">
          <div className="card border-0 shadow-sm rounded-3">
            <div className="card-header bg-white py-3 d-flex justify-content-between align-items-center border-bottom">
              <h6 className="fw-bold mb-0" style={{ color: '#102A43' }}>
                <i className="bi bi-person-lines-fill text-warning me-2"></i>Personnel Information
              </h6>
              <button
                type="button"
                className="btn btn-sm btn-outline-secondary px-3"
                onClick={() => { setEditing(!editing); setProfileMsg(''); setProfileErr('') }}
              >
                {editing ? 'Cancel' : 'Edit Profile'}
              </button>
            </div>

            <div className="card-body p-4">
              {profileMsg && <div className="alert alert-success py-2 small shadow-sm">{profileMsg}</div>}
              {profileErr && <div className="alert alert-danger py-2 small shadow-sm">{profileErr}</div>}

              {editing ? (
                <form onSubmit={handleProfileSave}>
                  <div className="row g-3">
                    <div className="col-md-6">
                      <label className="form-label fw-semibold small" style={{ color: '#334E68' }}>First Name</label>
                      <input
                        type="text"
                        className="form-control"
                        value={form.first_name}
                        onChange={e => setForm(p => ({ ...p, first_name: e.target.value }))}
                      />
                    </div>
                    <div className="col-md-6">
                      <label className="form-label fw-semibold small" style={{ color: '#334E68' }}>Last Name</label>
                      <input
                        type="text"
                        className="form-control"
                        value={form.last_name}
                        onChange={e => setForm(p => ({ ...p, last_name: e.target.value }))}
                      />
                    </div>
                    <div className="col-md-6">
                      <label className="form-label fw-semibold small" style={{ color: '#334E68' }}>Email Address</label>
                      <input
                        type="email"
                        className="form-control"
                        value={form.email}
                        onChange={e => setForm(p => ({ ...p, email: e.target.value }))}
                      />
                    </div>
                    <div className="col-md-6">
                      <label className="form-label fw-semibold small" style={{ color: '#334E68' }}>Contact Phone</label>
                      <input
                        type="text"
                        className="form-control"
                        value={form.phone}
                        onChange={e => setForm(p => ({ ...p, phone: e.target.value }))}
                      />
                    </div>
                    <div className="col-md-6">
                      <label className="form-label fw-semibold small" style={{ color: '#334E68' }}>Department / Wing</label>
                      <input
                        type="text"
                        className="form-control"
                        value={form.department}
                        onChange={e => setForm(p => ({ ...p, department: e.target.value }))}
                      />
                    </div>
                    <div className="col-md-6">
                      <label className="form-label fw-semibold small" style={{ color: '#334E68' }}>Base / City</label>
                      <input
                        type="text"
                        className="form-control"
                        value={form.city}
                        onChange={e => setForm(p => ({ ...p, city: e.target.value }))}
                      />
                    </div>
                  </div>
                  <div className="mt-4 pt-2 border-top d-flex justify-content-end gap-2">
                    <button type="button" className="btn btn-sm btn-secondary" onClick={() => setEditing(false)}>Cancel</button>
                    <button type="submit" className="btn btn-sm btn-navy px-4" disabled={profileLoading}>
                      {profileLoading ? 'Saving...' : 'Save Changes'}
                    </button>
                  </div>
                </form>
              ) : (
                <div className="d-flex flex-column gap-3 small">
                  <div className="d-flex justify-content-between pb-2 border-bottom">
                    <span className="text-muted">Username Identifier</span>
                    <span className="fw-bold" style={{ color: '#102A43' }}>{user?.username}</span>
                  </div>
                  <div className="d-flex justify-content-between pb-2 border-bottom">
                    <span className="text-muted">Email Address</span>
                    <span className="fw-semibold text-dark">{user?.email || '—'}</span>
                  </div>
                  <div className="d-flex justify-content-between pb-2 border-bottom">
                    <span className="text-muted">Designation / Role</span>
                    <span className="badge bg-warning text-dark">{user?.groups?.[0] || 'Staff'}</span>
                  </div>
                  <div className="d-flex justify-content-between pb-2 border-bottom">
                    <span className="text-muted">Contact Phone</span>
                    <span className="fw-semibold text-dark">{user?.profile?.phone || '—'}</span>
                  </div>
                  <div className="d-flex justify-content-between pb-2 border-bottom">
                    <span className="text-muted">Assigned Department</span>
                    <span className="fw-semibold text-dark">{user?.profile?.department || '—'}</span>
                  </div>
                  <div className="d-flex justify-content-between pb-2">
                    <span className="text-muted">Duty Station / City</span>
                    <span className="fw-semibold text-dark">{user?.profile?.city || '—'}</span>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Change Password Card */}
        <div className="col-lg-5">
          <div className="card border-0 shadow-sm rounded-3">
            <div className="card-header bg-white py-3 border-bottom">
              <h6 className="fw-bold mb-0" style={{ color: '#102A43' }}>
                <i className="bi bi-key-fill text-warning me-2"></i>Change Password
              </h6>
            </div>

            <div className="card-body p-4">
              {pwMsg && <div className="alert alert-success py-2 small shadow-sm">{pwMsg}</div>}
              {pwErr && <div className="alert alert-danger py-2 small shadow-sm">{pwErr}</div>}

              <form onSubmit={handlePasswordSubmit}>
                <div className="mb-3">
                  <label className="form-label fw-semibold small" style={{ color: '#334E68' }}>Current Password</label>
                  <input
                    type="password"
                    className="form-control"
                    placeholder="Enter current password"
                    value={pwForm.old_password}
                    onChange={e => setPwForm(p => ({ ...p, old_password: e.target.value }))}
                  />
                </div>

                <div className="mb-3">
                  <label className="form-label fw-semibold small" style={{ color: '#334E68' }}>New Password (min. 8 chars)</label>
                  <input
                    type="password"
                    className="form-control"
                    placeholder="Enter new strong password"
                    value={pwForm.new_password}
                    onChange={e => setPwForm(p => ({ ...p, new_password: e.target.value }))}
                  />
                </div>

                <div className="mb-4">
                  <label className="form-label fw-semibold small" style={{ color: '#334E68' }}>Confirm New Password</label>
                  <input
                    type="password"
                    className="form-control"
                    placeholder="Re-type new password"
                    value={pwForm.confirm_password}
                    onChange={e => setPwForm(p => ({ ...p, confirm_password: e.target.value }))}
                  />
                </div>

                <button
                  type="submit"
                  className="btn btn-navy w-100 py-2 d-flex align-items-center justify-content-center gap-2 shadow-sm"
                  disabled={pwLoading}
                >
                  {pwLoading ? (
                    <>
                      <span className="spinner-border spinner-border-sm" role="status"></span>
                      <span>Updating Password...</span>
                    </>
                  ) : (
                    <>
                      <i className="bi bi-shield-check text-warning"></i>
                      <span>Update Password</span>
                    </>
                  )}
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
