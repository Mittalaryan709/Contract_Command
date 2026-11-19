import { Link } from 'react-router-dom'

export default function LandingPage() {
  return (
    <div>
      {/* HERO SECTION */}
      <section style={{ background: 'linear-gradient(135deg, #0B1F33 0%, #102A43 60%, #1a3a5c 100%)', color: '#fff', padding: '100px 0 80px' }}>
        <div className="container">
          <div className="row align-items-center">
            <div className="col-lg-7">
              <div className="mb-3">
                <span style={{ background: '#E58A24', color: '#fff', padding: '4px 12px', borderRadius: '20px', fontSize: '.8rem', fontWeight: 600 }}>P07 — HCLTech MCA Project</span>
              </div>
              <h1 style={{ fontSize: 'clamp(2rem,5vw,3.2rem)', fontWeight: 800, lineHeight: 1.15, marginBottom: '20px' }}>
                ContractCommand
                <br />
                <span style={{ color: '#E58A24' }}>Defence Contract &</span>
                <br />
                Procurement Platform
              </h1>
              <p style={{ fontSize: '1.1rem', color: 'rgba(255,255,255,.8)', maxWidth: '540px', lineHeight: 1.7, marginBottom: '36px' }}>
                A centralized digital platform for transparent, accountable and efficient management of defence contracts, procurement planning, vendor evaluation and financial processing — aligned with India's Defence Acquisition Procedure 2020.
              </p>
              <div className="d-flex gap-3 flex-wrap">
                <Link to="/login" className="btn btn-lg" style={{ background: '#E58A24', color: '#fff', fontWeight: 600, padding: '12px 32px', borderRadius: '8px' }}>
                  <i className="bi bi-shield-lock me-2"></i>Access Portal
                </Link>
                <Link to="/about" className="btn btn-lg btn-outline-light" style={{ padding: '12px 32px', borderRadius: '8px' }}>
                  <i className="bi bi-info-circle me-2"></i>Explore Platform
                </Link>
              </div>
            </div>
            <div className="col-lg-5 mt-5 mt-lg-0 d-none d-lg-block text-center">
              <div style={{ background: 'rgba(255,255,255,.05)', borderRadius: '16px', padding: '40px', border: '1px solid rgba(255,255,255,.1)' }}>
                <i className="bi bi-shield-fill-check" style={{ fontSize: '5rem', color: '#E58A24', display: 'block', marginBottom: '20px' }}></i>
                <div className="row g-3 text-center">
                  {[['bi-file-earmark-text','Contracts'],['bi-clipboard-check','Procurement'],['bi-building-check','Vendors'],['bi-cash-stack','Finance']].map(([ic,lb]) => (
                    <div className="col-6" key={lb}>
                      <div style={{ background: 'rgba(255,255,255,.07)', borderRadius: '10px', padding: '16px 8px' }}>
                        <i className={`bi ${ic}`} style={{ fontSize: '1.6rem', color: '#E58A24', display: 'block' }}></i>
                        <small style={{ color: 'rgba(255,255,255,.8)', fontSize: '.75rem' }}>{lb}</small>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* STATS BAR */}
      <section style={{ background: '#334E68', padding: '28px 0' }}>
        <div className="container">
          <div className="row text-center text-white g-3">
            {[['35+','Active Contracts'],['50+','Registered Vendors'],['₹500 Cr+','Contract Value'],['4','Core Modules']].map(([val,lbl]) => (
              <div className="col-6 col-md-3" key={lbl}>
                <div style={{ fontSize: '1.8rem', fontWeight: 800, color: '#E58A24' }}>{val}</div>
                <div style={{ fontSize: '.82rem', color: 'rgba(255,255,255,.75)' }}>{lbl}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ABOUT */}
      <section style={{ background: '#fff', padding: '80px 0' }}>
        <div className="container">
          <div className="row align-items-center g-5">
            <div className="col-lg-6">
              <div className="mb-3"><span style={{ color: '#E58A24', fontWeight: 700, textTransform: 'uppercase', fontSize: '.8rem', letterSpacing: '1px' }}>About the Platform</span></div>
              <h2 style={{ color: '#102A43', fontWeight: 800, marginBottom: '20px' }}>Streamlining Defence Procurement Management</h2>
              <p style={{ color: '#627D98', lineHeight: 1.8 }}>ContractCommand is a comprehensive digital management system designed to bring transparency, accountability and efficiency to defence contract and procurement workflows. Built as an MCA academic project, it demonstrates enterprise-grade solutions for real-world defence sector challenges.</p>
              <p style={{ color: '#627D98', lineHeight: 1.8 }}>The platform supports role-based access for Administrators, Contracts Managers and Safety Officers, with full audit trails and digital record management aligned with DAP 2020 principles.</p>
              <div className="mt-4 d-flex gap-2 flex-wrap">
                {['DAP 2020 Aligned','Role-Based Access','Digital Records','INR Accounting'].map(tag => (
                  <span key={tag} style={{ background: '#F3F6F9', color: '#102A43', border: '1px solid #dee2e6', borderRadius: '20px', padding: '4px 14px', fontSize: '.8rem', fontWeight: 600 }}>{tag}</span>
                ))}
              </div>
            </div>
            <div className="col-lg-6">
              <div className="row g-3">
                {[
                  { icon: 'bi-lock-fill', title: 'Secure Access', desc: 'JWT-based role authentication with 8-hour token expiry', color: '#102A43' },
                  { icon: 'bi-graph-up-arrow', title: 'Real-time Tracking', desc: 'Live contract and procurement status monitoring', color: '#E58A24' },
                  { icon: 'bi-people-fill', title: 'Role-based Control', desc: 'Three-tier permission model with server-side enforcement', color: '#287A4B' },
                  { icon: 'bi-cloud-upload-fill', title: 'Digital Records', desc: 'Centralized document management and audit trails', color: '#334E68' },
                ].map(f => (
                  <div className="col-6" key={f.title}>
                    <div style={{ background: '#F3F6F9', borderRadius: '12px', padding: '20px', height: '100%' }}>
                      <i className={`bi ${f.icon}`} style={{ fontSize: '1.6rem', color: f.color, display: 'block', marginBottom: '10px' }}></i>
                      <div style={{ fontWeight: 700, color: '#102A43', marginBottom: '6px', fontSize: '.9rem' }}>{f.title}</div>
                      <div style={{ fontSize: '.8rem', color: '#627D98', lineHeight: 1.5 }}>{f.desc}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* MODULES */}
      <section style={{ background: '#F3F6F9', padding: '80px 0' }}>
        <div className="container">
          <div className="text-center mb-5">
            <span style={{ color: '#E58A24', fontWeight: 700, textTransform: 'uppercase', fontSize: '.8rem', letterSpacing: '1px' }}>Platform Capabilities</span>
            <h2 style={{ color: '#102A43', fontWeight: 800, marginTop: '8px' }}>Four Integrated Modules</h2>
          </div>
          <div className="row g-4">
            {[
              { icon: 'bi-file-earmark-text', title: 'Contract Repository', desc: 'Manage the full contract lifecycle from draft creation through active management to completion. Track contract values, vendor assignments, and key dates.', tags: ['CC-YYYY-NNNN Format','Status Tracking','Document Management'], color: '#102A43' },
              { icon: 'bi-clipboard-data', title: 'Procurement Planning', desc: 'Create and manage procurement plans with fiscal year budgets. Submit and track requisitions with multi-level approval workflows and priority management.', tags: ['Budget Tracking','Approval Workflows','Line Items'], color: '#334E68' },
              { icon: 'bi-building-check', title: 'Vendor Management', desc: 'Register and evaluate vendors using a 4-pillar scoring system covering quality, delivery, pricing and compliance. Track GSTIN, PAN and Indian state details.', tags: ['4-Pillar Scoring','GSTIN/PAN','Category Wise'], color: '#287A4B' },
              { icon: 'bi-cash-stack', title: 'Finance & Payments', desc: 'Process invoices with automatic 18% GST calculation. Record NEFT, RTGS, IMPS payments and track outstanding balances in Indian Rupees (₹).', tags: ['Auto GST 18%','NEFT/RTGS/IMPS','INR Formatting'], color: '#E58A24' },
            ].map(m => (
              <div className="col-md-6 col-lg-3" key={m.title}>
                <div className="module-card">
                  <div style={{ width: 48, height: 48, background: m.color, borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '16px' }}>
                    <i className={`bi ${m.icon} text-white fs-5`}></i>
                  </div>
                  <h5 style={{ color: '#102A43', fontWeight: 700, marginBottom: '10px' }}>{m.title}</h5>
                  <p style={{ color: '#627D98', fontSize: '.87rem', lineHeight: 1.6 }}>{m.desc}</p>
                  <div className="mt-3 d-flex gap-1 flex-wrap">
                    {m.tags.map(t => <span key={t} style={{ background: '#F3F6F9', border: '1px solid #dee2e6', borderRadius: '4px', padding: '2px 8px', fontSize: '.72rem', color: '#334E68' }}>{t}</span>)}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* INDIAN DEFENCE CONTEXT */}
      <section style={{ background: '#0B1F33', padding: '80px 0', color: '#fff' }}>
        <div className="container">
          <div className="text-center mb-5">
            <span style={{ background: '#E58A24', color: '#fff', padding: '4px 12px', borderRadius: '20px', fontSize: '.8rem', fontWeight: 600 }}>🇮🇳 Indigenous Procurement</span>
            <h2 style={{ fontWeight: 800, marginTop: '16px' }}>Aligned with India's Defence Framework</h2>
            <p style={{ color: 'rgba(255,255,255,.65)', maxWidth: '600px', margin: '12px auto 0' }}>
              ContractCommand incorporates reference information from India's key defence procurement and indigenisation initiatives.
            </p>
          </div>
          <div className="row g-3">
            {[
              { icon: '📋', title: 'DAP 2020', desc: 'Defence Acquisition Procedure 2020 — the foundational framework for all defence procurements.' },
              { icon: '🏭', title: 'Make in India', desc: 'Indigenous design, development and manufacturing of defence equipment.' },
              { icon: '🇮🇳', title: 'Atmanirbhar Bharat', desc: 'Self-reliant India initiative promoting domestic defence production.' },
              { icon: '🚀', title: 'iDEX', desc: 'Innovations for Defence Excellence — fostering defence innovation ecosystem.' },
              { icon: '⚙️', title: 'SRIJAN', desc: 'Indigenisation portal to substitute imports with domestic production.' },
              { icon: '🛒', title: 'GeM Portal', desc: 'Government e-Marketplace for procurement of goods and services.' },
            ].map(item => (
              <div className="col-md-4 col-lg-2" key={item.title}>
                <div style={{ background: 'rgba(255,255,255,.06)', border: '1px solid rgba(255,255,255,.1)', borderRadius: '12px', padding: '20px', textAlign: 'center', height: '100%' }}>
                  <div style={{ fontSize: '2rem', marginBottom: '10px' }}>{item.icon}</div>
                  <div style={{ fontWeight: 700, fontSize: '.9rem', marginBottom: '6px', color: '#E58A24' }}>{item.title}</div>
                  <div style={{ fontSize: '.75rem', color: 'rgba(255,255,255,.6)', lineHeight: 1.5 }}>{item.desc}</div>
                </div>
              </div>
            ))}
          </div>
          <div className="text-center mt-4">
            <small style={{ color: 'rgba(255,255,255,.4)' }}>ContractCommand is an academic project. Not affiliated with MoD, GoI or any official government platform.</small>
          </div>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section style={{ background: '#fff', padding: '80px 0' }}>
        <div className="container">
          <div className="text-center mb-5">
            <h2 style={{ color: '#102A43', fontWeight: 800 }}>How It Works</h2>
          </div>
          <div className="row g-4 justify-content-center">
            {[
              { n: '01', icon: 'bi-shield-lock', title: 'Login & Authenticate', desc: 'Sign in with your role-based credentials. JWT tokens secure every session with an 8-hour lifetime.' },
              { n: '02', icon: 'bi-file-earmark-text', title: 'Manage Contracts & Procurement', desc: 'Create contracts, plan procurement, raise requisitions and get approvals through digital workflows.' },
              { n: '03', icon: 'bi-cash-coin', title: 'Track Finance & Vendors', desc: 'Process GST invoices, record NEFT/RTGS payments and evaluate vendor performance with scoring.' },
            ].map(step => (
              <div className="col-md-4" key={step.n}>
                <div className="text-center p-4">
                  <div style={{ width: 60, height: 60, background: '#102A43', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px', color: '#E58A24', fontWeight: 800, fontSize: '1rem' }}>{step.n}</div>
                  <i className={`bi ${step.icon} fs-2 mb-3`} style={{ color: '#102A43', display: 'block' }}></i>
                  <h5 style={{ color: '#102A43', fontWeight: 700 }}>{step.title}</h5>
                  <p style={{ color: '#627D98', fontSize: '.87rem', lineHeight: 1.6 }}>{step.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section style={{ background: 'linear-gradient(135deg, #102A43, #0B1F33)', padding: '64px 0', color: '#fff', textAlign: 'center' }}>
        <div className="container">
          <h2 style={{ fontWeight: 800, marginBottom: '12px' }}>Ready to Manage Defence Contracts?</h2>
          <p style={{ color: 'rgba(255,255,255,.75)', marginBottom: '32px', fontSize: '1.05rem' }}>Access the secure portal to begin managing contracts, procurement and vendor workflows.</p>
          <Link to="/login" className="btn btn-lg" style={{ background: '#E58A24', color: '#fff', fontWeight: 700, padding: '14px 40px', borderRadius: '8px' }}>
            <i className="bi bi-shield-lock me-2"></i>Access Portal
          </Link>
        </div>
      </section>
    </div>
  )
}
