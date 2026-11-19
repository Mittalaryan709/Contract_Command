export default function AboutPage() {
  return (
    <div>
      <div style={{ background: 'linear-gradient(135deg,#0B1F33,#102A43)', color:'#fff', padding:'60px 0' }}>
        <div className="container">
          <h1 style={{fontWeight:800}}>About ContractCommand</h1>
          <p style={{color:'rgba(255,255,255,.75)'}}>P07 – HCLTech Career Shaper | MCA 2nd Year | ABES Engineering College</p>
        </div>
      </div>
      <div className="container py-5">
        <div className="row g-5">
          <div className="col-lg-7">
            <h3 style={{color:'#102A43',fontWeight:700}}>Project Overview</h3>
            <p style={{color:'#627D98',lineHeight:1.8}}>ContractCommand is a comprehensive Defence Contract and Procurement Management Platform developed as the P07 project for the HCLTech Career Shaper programme by MCA 2nd Year students at ABES Engineering College. The platform addresses the complex challenges of managing defence contracts, procurement plans, vendor relationships and financial tracking in the aerospace and defence domain.</p>
            <h4 className="mt-4" style={{color:'#102A43',fontWeight:700}}>Mission</h4>
            <p style={{color:'#627D98',lineHeight:1.8}}>To provide a transparent, accountable and secure digital platform for defence procurement stakeholders, enabling efficient contract lifecycle management while maintaining compliance with India's Defence Acquisition Procedure 2020.</p>
            <h4 className="mt-4" style={{color:'#102A43',fontWeight:700}}>Academic Context</h4>
            <div style={{background:'#F3F6F9',borderRadius:'12px',padding:'20px'}}>
              {[['Institution','ABES Engineering College'],['Programme','MCA (Master of Computer Applications)'],['Year','2nd Year'],['Project Code','P07 — ContractCommand'],['Industry Partner','HCLTech Career Shaper'],['Domain','Aerospace & Defence']].map(([k,v])=>(
                <div key={k} className="d-flex gap-3 mb-2">
                  <span style={{minWidth:140,color:'#334E68',fontWeight:600,fontSize:'.9rem'}}>{k}</span>
                  <span style={{color:'#102A43',fontSize:'.9rem'}}>{v}</span>
                </div>
              ))}
            </div>
          </div>
          <div className="col-lg-5">
            <h4 style={{color:'#102A43',fontWeight:700}}>Technology Stack</h4>
            <div className="d-flex flex-column gap-3">
              {[
                {layer:'Frontend',tech:'React 18 + Vite',color:'#61DAFB',bg:'#0B1F33'},
                {layer:'UI Framework',tech:'Bootstrap 5 + Bootstrap Icons',color:'#7952B3',bg:'#F8F5FF'},
                {layer:'State & Auth',tech:'Context API + JWT',color:'#E58A24',bg:'#FFF8F0'},
                {layer:'HTTP Client',tech:'Axios with interceptors',color:'#5A29E4',bg:'#F5F0FF'},
                {layer:'Charts',tech:'Chart.js + react-chartjs-2',color:'#FF6384',bg:'#FFF5F7'},
                {layer:'Backend',tech:'Django 4.2 LTS + DRF 3.14',color:'#092E20',bg:'#E8F5E9'},
                {layer:'Database',tech:'SQLite (dev) / MySQL 8.0',color:'#4479A1',bg:'#EEF7FF'},
                {layer:'Auth Protocol',tech:'JWT (SimpleJWT, 8h tokens)',color:'#102A43',bg:'#F3F6F9'},
              ].map(t=>(
                <div key={t.layer} style={{background:t.bg,borderRadius:'8px',padding:'12px 16px',display:'flex',alignItems:'center',justifyContent:'space-between'}}>
                  <span style={{fontSize:'.82rem',color:'#627D98'}}>{t.layer}</span>
                  <span style={{fontWeight:700,fontSize:'.85rem',color:t.color}}>{t.tech}</span>
                </div>
              ))}
            </div>
            <div className="mt-4 p-3" style={{background:'#FFF8F0',border:'1px solid #E58A24',borderRadius:'10px'}}>
              <small style={{color:'#834d00'}}><strong>⚠️ Disclaimer:</strong> ContractCommand is an academic project. It is not affiliated with the Ministry of Defence, Government of India, or any official government procurement system. All data used is synthetic and for demonstration purposes only.</small>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
