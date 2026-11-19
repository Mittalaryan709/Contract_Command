export default function ContactPage() {
  return (
    <div>
      <div style={{background:'linear-gradient(135deg,#0B1F33,#102A43)',color:'#fff',padding:'60px 0'}}>
        <div className="container">
          <h1 style={{fontWeight:800}}>Contact & Support</h1>
          <p style={{color:'rgba(255,255,255,.75)'}}>ContractCommand P07 Project Information</p>
        </div>
      </div>
      <div className="container py-5">
        <div className="row g-4 justify-content-center">
          <div className="col-md-6">
            <div style={{background:'#fff',borderRadius:'16px',padding:'32px',boxShadow:'0 2px 12px rgba(0,0,0,.08)'}}>
              <div style={{width:48,height:48,background:'#102A43',borderRadius:'10px',display:'flex',alignItems:'center',justifyContent:'center',marginBottom:'20px'}}>
                <i className="bi bi-mortarboard-fill text-white fs-5"></i>
              </div>
              <h4 style={{color:'#102A43',fontWeight:700}}>Academic Project</h4>
              <div className="mt-3">
                {[['Institution','ABES Engineering College'],['Programme','MCA 2nd Year'],['Project','P07 — ContractCommand'],['Industry Partner','HCLTech Career Shaper'],['Domain','Aerospace & Defence']].map(([k,v])=>(
                  <div key={k} className="d-flex gap-3 mb-2 pb-2" style={{borderBottom:'1px solid #F3F6F9'}}>
                    <span style={{minWidth:120,color:'#627D98',fontSize:'.88rem'}}>{k}</span>
                    <span style={{color:'#102A43',fontWeight:600,fontSize:'.88rem'}}>{v}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
          <div className="col-md-6">
            <div style={{background:'#fff',borderRadius:'16px',padding:'32px',boxShadow:'0 2px 12px rgba(0,0,0,.08)'}}>
              <div style={{width:48,height:48,background:'#E58A24',borderRadius:'10px',display:'flex',alignItems:'center',justifyContent:'center',marginBottom:'20px'}}>
                <i className="bi bi-headset text-white fs-5"></i>
              </div>
              <h4 style={{color:'#102A43',fontWeight:700}}>Technical Support</h4>
              <p style={{color:'#627D98',lineHeight:1.7}}>For technical queries related to the ContractCommand platform, please reach out through your HCLTech mentor or submit a query through the project submission portal.</p>
              <div style={{background:'#F3F6F9',borderRadius:'10px',padding:'16px',marginTop:'16px'}}>
                <div className="d-flex align-items-center gap-2 mb-2">
                  <i className="bi bi-github" style={{color:'#102A43',fontSize:'1.1rem'}}></i>
                  <a href="https://github.com/Mittalaryan709/Contract_Command" target="_blank" rel="noreferrer" style={{color:'#102A43',fontWeight:600,fontSize:'.9rem'}}>github.com/Mittalaryan709/Contract_Command</a>
                </div>
                <div className="d-flex align-items-center gap-2">
                  <i className="bi bi-code-slash" style={{color:'#334E68',fontSize:'1.1rem'}}></i>
                  <span style={{color:'#627D98',fontSize:'.85rem'}}>Backend API Docs: /api/docs/swagger/</span>
                </div>
              </div>
            </div>
            <div className="mt-3 p-3" style={{background:'#FFF8F0',border:'1px solid #E58A24',borderRadius:'10px'}}>
              <small style={{color:'#834d00'}}><i className="bi bi-info-circle me-1"></i>This is a demonstration system. All data is synthetic. Not connected to any live government or defence network.</small>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
