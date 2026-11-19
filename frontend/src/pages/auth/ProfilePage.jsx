import { useState } from 'react'
import { useAuth } from '../../context/AuthContext.jsx'
import { updateProfile, changePassword } from '../../api/authApi.js'

export default function ProfilePage() {
  const { user } = useAuth()
  const [editing, setEditing] = useState(false)
  const [form, setForm] = useState({ first_name: user?.first_name || '', last_name: user?.last_name || '', email: user?.email || '', phone: user?.profile?.phone || '', department: user?.profile?.department || '', city: user?.profile?.city || '' })
  const [pwForm, setPwForm] = useState({ old_password: '', new_password: '' })
  const [msg, setMsg] = useState('')
  const [err, setErr] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSave = async (e) => {
    e.preventDefault(); setLoading(true); setMsg(''); setErr('')
    try {
      await updateProfile(form)
      setMsg('Profile updated successfully.'); setEditing(false)
    } catch (e) { setErr(e.response?.data?.message || 'Update failed.') }
    finally { setLoading(false) }
  }

  const handlePwChange = async (e) => {
    e.preventDefault(); setLoading(true); setMsg(''); setErr('')
    try {
      await changePassword(pwForm)
      setMsg('Password changed successfully.'); setPwForm({ old_password: '', new_password: '' })
    } catch (e) { setErr(e.response?.data?.message || 'Password change failed.') }
    finally { setLoading(false) }
  }

  return (
    <div>
      <div className="d-flex align-items-center gap-3 mb-4">
        <div style={{ width: 48, height: 48, background: '#102A43', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#E58A24', fontWeight: 800, fontSize: '1.3rem' }}>{user?.first_name?.[0] ?? 'U'}</div>
        <div>
          <h4 className="mb-0" style={{ color: '#102A43', fontWeight: 700 }}>{user?.full_name || user?.username}</h4>
          <span className="badge" style={{ background: '#102A43' }}>{user?.groups?.[0]}</span>
        </div>
      </div>
      {msg && <div className="alert alert-success">{msg}</div>}
      {err && <div className="alert alert-danger">{err}</div>}
      <div className="row g-4">
        <div className="col-lg-6">
          <div className="card border-0 shadow-sm">
            <div className="card-header d-flex justify-content-between align-items-center" style={{ background: '#F3F6F9' }}>
              <span className="fw-bold" style={{ color: '#102A43' }}>Profile Information</span>
              <button className="btn btn-sm btn-outline-secondary" onClick={() => setEditing(!editing)}>{editing ? 'Cancel' : 'Edit'}</button>
            </div>
            <div className="card-body">
              {editing ? (
                <form onSubmit={handleSave}>
                  {[['first_name','First Name'],['last_name','Last Name'],['email','Email'],['phone','Phone'],['department','Department'],['city','City']].map(([k,l])=>(
                    <div className="mb-3" key={k}>
                      <label className="form-label fw-semibold small" style={{color:'#334E68'}}>{l}</label>
                      <input className="form-control" value={form[k]} onChange={e=>setForm(p=>({...p,[k]:e.target.value}))} />
                    </div>
                  ))}
                  <button type="submit" className="btn w-100" style={{background:'#102A43',color:'#fff'}} disabled={loading}>Save Changes</button>
                </form>
              ) : (
                <div>
                  {[['Username',user?.username],['Email',user?.email],['Phone',user?.profile?.phone||'—'],['Department',user?.profile?.department||'—'],['City',user?.profile?.city||'—'],['Role',user?.groups?.[0]||'—']].map(([k,v])=>(
                    <div key={k} className="d-flex gap-3 mb-3 pb-2" style={{borderBottom:'1px solid #F3F6F9'}}>
                      <span style={{minWidth:120,color:'#627D98',fontSize:'.88rem'}}>{k}</span>
                      <span style={{color:'#102A43',fontWeight:600,fontSize:'.88rem'}}>{v}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
        <div className="col-lg-6">
          <div className="card border-0 shadow-sm">
            <div className="card-header" style={{ background: '#F3F6F9' }}>
              <span className="fw-bold" style={{ color: '#102A43' }}>Change Password</span>
            </div>
            <div className="card-body">
              <form onSubmit={handlePwChange}>
                <div className="mb-3">
                  <label className="form-label fw-semibold small" style={{color:'#334E68'}}>Current Password</label>
                  <input type="password" className="form-control" value={pwForm.old_password} onChange={e=>setPwForm(p=>({...p,old_password:e.target.value}))} />
                </div>
                <div className="mb-4">
                  <label className="form-label fw-semibold small" style={{color:'#334E68'}}>New Password</label>
                  <input type="password" className="form-control" value={pwForm.new_password} onChange={e=>setPwForm(p=>({...p,new_password:e.target.value}))} />
                </div>
                <button type="submit" className="btn w-100" style={{background:'#E58A24',color:'#fff'}} disabled={loading}>Update Password</button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
