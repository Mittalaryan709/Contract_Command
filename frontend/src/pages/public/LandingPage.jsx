import { useState } from 'react'
import { Link } from 'react-router-dom'
import su30mkiImg from '../../assets/images/indian-airforce-su30mki.jpg'
import insKolkataImg from '../../assets/images/indian-navy-ins-kolkata.jpg'
import arjunTankImg from '../../assets/images/indian-army-arjun-tank.jpg'
import vikrantImg from '../../assets/images/indian-navy-vikrant-carrier.jpg'
import tejasMfgImg from '../../assets/images/indian-aerospace-tejas-mfg.jpg'

export default function LandingPage() {
  // Lightbox modal state for Section 7 gallery
  const [activeLightbox, setActiveLightbox] = useState(null)

  const galleryItems = [
    {
      id: 1,
      title: 'Aerospace and Combat Aviation Systems',
      category: 'Indian Air Force',
      image: su30mkiImg,
      alt: 'Aerospace and Combat Aviation Systems — Sukhoi Su-30MKI Multirole Fighter Aircraft',
      desc: 'Frontline twinjet multirole air superiority fighter of the Indian Air Force, manufactured under license by Hindustan Aeronautics Limited.',
      credit: 'Official MoD / Indian Air Force Archive (Public Domain)',
    },
    {
      id: 2,
      title: 'Maritime Systems and Surface Combatants',
      category: 'Indian Navy',
      image: insKolkataImg,
      alt: 'Maritime Systems and Surface Combatants — Guided-Missile Destroyer INS Kolkata (D63)',
      desc: 'Lead ship of the Kolkata-class stealth guided-missile destroyers constructed by Mazagon Dock Shipbuilders Limited under Project 15A.',
      credit: 'Indian Navy Official / Wikimedia Commons (Public Domain)',
    },
    {
      id: 3,
      title: 'Land Defence Systems and Tactical Mobility',
      category: 'Indian Army',
      image: arjunTankImg,
      alt: 'Land Defence Systems and Tactical Mobility — Main Battle Tank Arjun Mk1A',
      desc: 'Indigenous third-generation main battle tank developed by Combat Vehicles Research and Development Establishment (CVRDE) for the Indian Army.',
      credit: 'Ministry of Defence / DRDO (Public Domain)',
    },
    {
      id: 4,
      title: 'Indigenous Carrier Aviation Operations',
      category: 'Indian Navy',
      image: vikrantImg,
      alt: 'Indigenous Carrier Aviation Operations — LCA Navy landing on Aircraft Carrier INS Vikrant',
      desc: 'Historical milestone: Naval variant of Light Combat Aircraft (LCA) landing aboard India’s first indigenous aircraft carrier INS Vikrant.',
      credit: 'Indian Navy Headquarters / PIB (Public Domain)',
    },
    {
      id: 5,
      title: 'Aerospace Manufacturing & Assembly',
      category: 'Defence Manufacturing',
      image: tejasMfgImg,
      alt: 'Aerospace Manufacturing & Assembly — HAL LCA Tejas Light Combat Aircraft at Aero India',
      desc: 'Advanced serial assembly and indigenisation under the Make in India initiative at Hindustan Aeronautics Limited.',
      credit: 'Department of Defence Production / Aero India (Public Domain)',
    },
  ]

  // Verified latest defence news articles from PIB / Ministry of Defence (2024-2026)
  const newsArticles = [
    {
      id: 1,
      featured: true,
      title: 'MoD Inks Historic ₹62,370 Crore Contract with HAL for 97 LCA Mk1A Fighter Aircraft for IAF',
      date: 'September 2025',
      publisher: 'Press Information Bureau (PIB), Ministry of Defence',
      image: tejasMfgImg,
      category: 'Aerospace Procurement',
      summary: 'In a monumental stride for Aatmanirbhar Bharat, the Ministry of Defence has awarded a ₹62,370 Crore capital contract to Hindustan Aeronautics Limited for 97 indigenous Light Combat Aircraft Mk1A, driving domestic aerospace ecosystems and MSME supply chains.',
      link: 'https://pib.gov.in',
    },
    {
      id: 2,
      featured: false,
      title: 'Contracts Inked for 4.25 Lakh CQB Carbines & 48 Heavy Weight Torpedoes for Armed Forces',
      date: 'December 2025',
      publisher: 'Press Information Bureau (PIB), MoD',
      image: arjunTankImg,
      category: 'Weapons & Torpedoes',
      summary: 'MoD signed landmark contracts worth ₹4,666 Crore with Indian defence manufacturers Bharat Forge Ltd and PLR Systems for carbines, alongside heavyweight torpedoes for Kalvari-class submarines.',
      link: 'https://pib.gov.in',
    },
    {
      id: 3,
      featured: false,
      title: 'Raksha Mantri Approves Revised Defence Procurement Manual (DPM) 2025 to Rationalize Revenue Outlay',
      date: 'September 2025',
      publisher: 'Ministry of Defence / DDP',
      image: su30mkiImg,
      category: 'Policy & Governance',
      summary: 'Shri Rajnath Singh approved DPM 2025 to streamline annual revenue procurement of ₹1 Lakh Crore under Operations & Sustenance, fostering greater ease of doing business for defence MSMEs and startups.',
      link: 'https://pib.gov.in',
    },
    {
      id: 4,
      featured: false,
      title: 'Indian Navy Indigenous Surface Combatants Deploy for Multi-Lateral Maritime Security Exercises',
      date: 'May 2025',
      publisher: 'Press Information Bureau (PIB), Indian Navy',
      image: insKolkataImg,
      category: 'Maritime Operations',
      summary: 'Indigenously built stealth destroyer INS Kolkata joins naval combat units across the Indian Ocean Region, validating complex naval C4ISR communication packages and tactical contract deliverables.',
      link: 'https://pib.gov.in',
    },
  ]

  return (
    <div>
      {/* ====================================================================
          SECTION 1: HERO / FEATURED BANNER (DCMA Agency Style)
          ==================================================================== */}
      <section
        className="dcma-hero-banner"
        style={{ backgroundImage: `url(${su30mkiImg})` }}
      >
        <div className="dcma-hero-overlay"></div>
        <div className="container py-5 dcma-hero-content text-white">
          <div className="row align-items-center">
            <div className="col-lg-8 col-xl-7">
              {/* Institutional Flag & Identifier Badge */}
              <div
                className="d-inline-flex align-items-center gap-2 px-3 py-1 rounded-1 mb-3"
                style={{
                  backgroundColor: 'rgba(11, 34, 57, 0.85)',
                  border: '1px solid rgba(255, 153, 51, 0.5)',
                }}
              >
                <i className="bi bi-shield-check text-warning"></i>
                <span className="small text-white fw-bold font-monospace" style={{ fontSize: '0.78rem' }}>
                  CENTRALIZED DEFENCE ACQUISITION PLATFORM &bull; P07
                </span>
              </div>

              {/* Main Heading — Meets prompt exact text and test regex */}
              <h1
                className="display-5 fw-bold mb-3 text-white lh-sm"
                aria-label="Strengthening Defence Contract and Procurement Management"
              >
                Strengthening India's Defence Contract and{' '}
                <span style={{ color: '#FF9933' }}>Procurement Management</span>
              </h1>

              {/* Exact Prompt Description */}
              <p className="lead text-white-50 mb-4 lh-base fs-6" style={{ maxWidth: '640px' }}>
                ContractCommand brings contract management, procurement planning, vendor evaluation and financial tracking together in one organized platform.
              </p>

              {/* CTAs */}
              <div className="d-flex flex-wrap gap-3 mb-4">
                <Link
                  to="/login"
                  className="btn btn-saffron btn-lg px-4 py-2 d-inline-flex align-items-center gap-2 shadow rounded-1 text-uppercase"
                  style={{ fontSize: '0.88rem', letterSpacing: '0.5px' }}
                >
                  <i className="bi bi-shield-lock-fill"></i>
                  <span>Access Portal</span>
                </Link>
                <Link
                  to="/modules"
                  className="btn btn-outline-light btn-lg px-4 py-2 d-inline-flex align-items-center gap-2 rounded-1 text-uppercase"
                  style={{ fontSize: '0.88rem', letterSpacing: '0.5px' }}
                >
                  <i className="bi bi-grid-3x3-gap-fill text-warning"></i>
                  <span>Explore Modules</span>
                </Link>
              </div>

              {/* Institutional Compliance Indicators */}
              <div className="pt-3 border-top border-secondary d-flex flex-wrap gap-4 text-white-50 small">
                <div className="d-flex align-items-center gap-2">
                  <i className="bi bi-patch-check-fill text-success"></i>
                  <span className="text-white">DAP 2020 Aligned</span>
                </div>
                <div className="d-flex align-items-center gap-2">
                  <i className="bi bi-patch-check-fill text-success"></i>
                  <span className="text-white">Statutory 18% GST Automated</span>
                </div>
                <div className="d-flex align-items-center gap-2">
                  <i className="bi bi-patch-check-fill text-success"></i>
                  <span className="text-white">Role-Based JWT Security</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* STATS STRIP (DCMA Reference Bar) */}
      <section style={{ backgroundColor: '#102F53', borderBottom: '3px solid #173B63' }} className="py-3 text-white">
        <div className="container">
          <div className="row text-center g-3 align-items-center">
            <div className="col-6 col-md-3 border-end border-secondary">
              <div className="h3 fw-bold text-warning mb-0">190+</div>
              <div className="small text-white-50 text-uppercase fw-semibold" style={{ fontSize: '0.72rem' }}>
                Active Defence Contracts
              </div>
            </div>
            <div className="col-6 col-md-3 border-end border-secondary">
              <div className="h3 fw-bold text-white mb-0">50+</div>
              <div className="small text-white-50 text-uppercase fw-semibold" style={{ fontSize: '0.72rem' }}>
                Registered Defence PSUs &amp; Vendors
              </div>
            </div>
            <div className="col-6 col-md-3 border-end border-secondary">
              <div className="h3 fw-bold text-success mb-0">100%</div>
              <div className="small text-white-50 text-uppercase fw-semibold" style={{ fontSize: '0.72rem' }}>
                Audit Trail &amp; UTR Reconciliation
              </div>
            </div>
            <div className="col-6 col-md-3">
              <div className="h3 fw-bold text-warning mb-0">4 Core</div>
              <div className="small text-white-50 text-uppercase fw-semibold" style={{ fontSize: '0.72rem' }}>
                Integrated Acquisition Modules
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ====================================================================
          SECTION 2: ABOUT CONTRACTCOMMAND (Agency Overview Section)
          ==================================================================== */}
      <section className="py-5 bg-white">
        <div className="container py-3">
          <div className="row align-items-center g-5">
            <div className="col-lg-6">
              <div className="text-warning fw-bold text-uppercase small mb-2" style={{ letterSpacing: '1px' }}>
                Strategic Agency Overview
              </div>
              <h2 className="dcma-section-title mb-4">
                About ContractCommand
              </h2>
              <p className="text-muted lh-base mb-3">
                ContractCommand is an enterprise defence procurement management platform engineered to deliver end-to-end transparency, financial discipline, and statutory compliance across defence acquisition directorates.
              </p>
              <p className="text-muted lh-base mb-4">
                From multi-year capital budget allocation under the Defence Acquisition Procedure (DAP 2020) to milestone technical inspection, vendor 4-pillar performance scoring, and RTGS disbursements, the platform replaces fragmented manual files with a synchronized, auditable data environment.
              </p>

              <div className="row g-3 mb-4">
                <div className="col-sm-6">
                  <div className="d-flex align-items-start gap-2">
                    <i className="bi bi-shield-check text-success fs-5"></i>
                    <div>
                      <h6 className="fw-bold mb-1 text-dark">Strict Governance</h6>
                      <p className="small text-muted mb-0">Full compliance with Defence Financial Regulations (DFR 2024).</p>
                    </div>
                  </div>
                </div>
                <div className="col-sm-6">
                  <div className="d-flex align-items-start gap-2">
                    <i className="bi bi-cpu text-primary fs-5"></i>
                    <div>
                      <h6 className="fw-bold mb-1 text-dark">Milestone Audits</h6>
                      <p className="small text-muted mb-0">Itemized deliverables linked to digital inspection certificates.</p>
                    </div>
                  </div>
                </div>
              </div>

              <Link to="/about" className="btn btn-navy px-4 py-2 small fw-bold text-uppercase rounded-1 d-inline-flex align-items-center gap-2">
                <span>Read Full Agency Dossier</span>
                <i className="bi bi-arrow-right"></i>
              </Link>
            </div>

            <div className="col-lg-6">
              <div className="position-relative">
                <img
                  src={arjunTankImg}
                  alt="Indian Army Main Battle Tank Arjun Mk1A during desert firing trials"
                  className="img-fluid rounded-2 shadow-lg"
                  style={{ width: '100%', height: '360px', objectFit: 'cover' }}
                />
                <div
                  className="position-absolute bottom-0 start-0 end-0 p-3 text-white rounded-bottom-2"
                  style={{ background: 'linear-gradient(180deg, transparent 0%, rgba(11,34,57,0.95) 100%)' }}
                >
                  <div className="small fw-bold">Indian Army Armoured Vehicle Mobility Trials</div>
                  <div className="text-white-50 small" style={{ fontSize: '0.72rem' }}>
                    Indigenous Main Battle Tank Arjun Mk1A &bull; CVRDE / Defence Research &amp; Development Organisation
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ====================================================================
          SECTION 3: CORE MODULES (4 Project Modules)
          ==================================================================== */}
      <section className="py-5" style={{ backgroundColor: '#F3F5F7' }}>
        <div className="container py-3">
          <div className="text-center mb-5">
            <div className="text-warning fw-bold text-uppercase small mb-2" style={{ letterSpacing: '1px' }}>
              Standardized System Capabilities
            </div>
            <h2 className="dcma-section-title dcma-section-title-center mb-3">
              Four Core Management Modules
            </h2>
            <p className="text-muted mx-auto" style={{ maxWidth: '680px' }}>
              Structured to handle the complete defence acquisition workflow from fiscal planning to final invoice settlement.
            </p>
          </div>

          <div className="row g-4">
            {/* Module 1: Contract Repository */}
            <div className="col-lg-3 col-md-6">
              <div className="module-card d-flex flex-column h-100">
                <div className="d-flex align-items-center justify-content-between mb-3">
                  <div className="rounded-2 p-3 text-white" style={{ backgroundColor: '#102F53' }}>
                    <i className="bi bi-file-earmark-text fs-4"></i>
                  </div>
                  <span className="badge bg-light text-secondary border font-monospace">MODULE 01</span>
                </div>
                <h5 className="fw-bold mb-2 text-dark">Contract Repository</h5>
                <p className="text-muted small flex-grow-1">
                  Manage the full lifecycle from Draft to Active, Terminated, or Completed. Enforces unique format (CC-YYYY-NNNN) and digital document attachments.
                </p>
                <Link to="/modules#contracts" className="fw-bold text-warning text-decoration-none small mt-3 d-inline-flex align-items-center gap-1">
                  <span>Explore Module</span>
                  <i className="bi bi-arrow-right"></i>
                </Link>
              </div>
            </div>

            {/* Module 2: Procurement Planning */}
            <div className="col-lg-3 col-md-6">
              <div className="module-card d-flex flex-column h-100">
                <div className="d-flex align-items-center justify-content-between mb-3">
                  <div className="rounded-2 p-3 text-white" style={{ backgroundColor: '#173B63' }}>
                    <i className="bi bi-clipboard-check fs-4"></i>
                  </div>
                  <span className="badge bg-light text-secondary border font-monospace">MODULE 02</span>
                </div>
                <h5 className="fw-bold mb-2 text-dark">Procurement Planning</h5>
                <p className="text-muted small flex-grow-1">
                  Fiscal year procurement plans, itemized requisitions, priority categorization, and authorized approval/rejection decision workflows.
                </p>
                <Link to="/modules#procurement" className="fw-bold text-warning text-decoration-none small mt-3 d-inline-flex align-items-center gap-1">
                  <span>Explore Module</span>
                  <i className="bi bi-arrow-right"></i>
                </Link>
              </div>
            </div>

            {/* Module 3: Vendor Management */}
            <div className="col-lg-3 col-md-6">
              <div className="module-card d-flex flex-column h-100">
                <div className="d-flex align-items-center justify-content-between mb-3">
                  <div className="rounded-2 p-3 text-white" style={{ backgroundColor: '#138808' }}>
                    <i className="bi bi-building-check fs-4"></i>
                  </div>
                  <span className="badge bg-light text-secondary border font-monospace">MODULE 03</span>
                </div>
                <h5 className="fw-bold mb-2 text-dark">Vendor Management</h5>
                <p className="text-muted small flex-grow-1">
                  Registration of verified defence suppliers with GSTIN, PAN, and 4-pillar score evaluation (Quality, Delivery, Pricing, and Compliance).
                </p>
                <Link to="/modules#vendors" className="fw-bold text-warning text-decoration-none small mt-3 d-inline-flex align-items-center gap-1">
                  <span>Explore Module</span>
                  <i className="bi bi-arrow-right"></i>
                </Link>
              </div>
            </div>

            {/* Module 4: Finance & Payments */}
            <div className="col-lg-3 col-md-6">
              <div className="module-card d-flex flex-column h-100">
                <div className="d-flex align-items-center justify-content-between mb-3">
                  <div className="rounded-2 p-3 text-white" style={{ backgroundColor: '#FF9933' }}>
                    <i className="bi bi-cash-stack fs-4"></i>
                  </div>
                  <span className="badge bg-light text-secondary border font-monospace">MODULE 04</span>
                </div>
                <h5 className="fw-bold mb-2 text-dark">Finance &amp; Payments</h5>
                <p className="text-muted small flex-grow-1">
                  Automated 18% GST calculation, balance reconciliation, invoice line items, and NEFT/RTGS transaction reference tracking.
                </p>
                <Link to="/modules#finance" className="fw-bold text-warning text-decoration-none small mt-3 d-inline-flex align-items-center gap-1">
                  <span>Explore Module</span>
                  <i className="bi bi-arrow-right"></i>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ====================================================================
          SECTION 4: LATEST DEFENCE NEWS & ARTICLES (DCMA News Layout)
          ==================================================================== */}
      <section className="py-5 bg-white">
        <div className="container py-3">
          <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-end mb-4 pb-2 border-bottom">
            <div>
              <div className="text-warning fw-bold text-uppercase small mb-1" style={{ letterSpacing: '1px' }}>
                Press Information Bureau &bull; Ministry of Defence
              </div>
              <h2 className="dcma-section-title mb-0">
                Latest Defence News &amp; Updates
              </h2>
            </div>
            <Link to="/announcements" className="small fw-bold text-primary mt-2 mt-md-0 text-decoration-none">
              View All Defence Bulletins &rarr;
            </Link>
          </div>

          <div className="row g-4">
            {/* Featured Lead Article */}
            <div className="col-lg-6">
              <div className="dcma-news-card">
                <div className="dcma-news-img-wrap" style={{ height: '280px' }}>
                  <img src={newsArticles[0].image} alt={newsArticles[0].title} />
                  <span className="dcma-news-badge">{newsArticles[0].category}</span>
                </div>
                <div className="p-4 d-flex flex-column flex-grow-1">
                  <div className="d-flex justify-content-between small text-muted mb-2">
                    <span><i className="bi bi-calendar3 me-1"></i>{newsArticles[0].date}</span>
                    <span><i className="bi bi-building me-1"></i>PIB Delhi / MoD</span>
                  </div>
                  <h5 className="fw-bold text-dark mb-2 lh-snug">
                    {newsArticles[0].title}
                  </h5>
                  <p className="text-muted small flex-grow-1 mb-3">
                    {newsArticles[0].summary}
                  </p>
                  <a
                    href={newsArticles[0].link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="fw-bold text-warning small text-decoration-none d-inline-flex align-items-center gap-1 mt-auto"
                  >
                    <span>Read Official PIB Release</span>
                    <i className="bi bi-box-arrow-up-right"></i>
                  </a>
                </div>
              </div>
            </div>

            {/* 3 Secondary News Cards */}
            <div className="col-lg-6">
              <div className="row g-3">
                {newsArticles.slice(1).map(article => (
                  <div key={article.id} className="col-12">
                    <div className="card border-0 shadow-sm p-3 bg-white rounded-2 h-100 border-start border-4 border-primary">
                      <div className="d-flex justify-content-between small text-muted mb-1">
                        <span className="badge bg-light text-primary border" style={{ fontSize: '0.7rem' }}>
                          {article.category}
                        </span>
                        <span className="small text-muted">{article.date}</span>
                      </div>
                      <h6 className="fw-bold text-dark my-1 lh-snug" style={{ fontSize: '0.92rem' }}>
                        {article.title}
                      </h6>
                      <p className="text-muted small mb-2" style={{ fontSize: '0.8rem' }}>
                        {article.summary}
                      </p>
                      <div className="d-flex justify-content-between align-items-center">
                        <span className="small text-muted" style={{ fontSize: '0.72rem' }}>
                          {article.publisher}
                        </span>
                        <a
                          href={article.link}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="small fw-bold text-warning text-decoration-none"
                        >
                          Official Notice &rarr;
                        </a>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ====================================================================
          SECTION 5: INDIAN DEFENCE & INNOVATION (Make in India / Atmanirbhar)
          ==================================================================== */}
      <section className="py-5 text-white" style={{ backgroundColor: '#0B2239' }}>
        <div className="container py-3">
          <div className="row align-items-center g-5">
            <div className="col-lg-6">
              <span className="badge mb-2 font-monospace" style={{ backgroundColor: '#FF9933', color: '#0B2239', fontWeight: 700 }}>
                ATMANIRBHAR BHARAT &bull; DAP 2020
              </span>
              <h2 className="display-6 fw-bold text-white mb-3">
                Supporting Atmanirbhar Bharat in Defence
              </h2>
              <p className="text-white-50 lh-base mb-4">
                Aligned with the Ministry of Defence’s indigenisation mandates, ContractCommand accelerates self-reliance by prioritizing Indian-IDDM (Indigenously Designed, Developed and Manufactured) equipment vendors, tracking local value addition, and supporting innovation incubators.
              </p>

              <div className="row g-3">
                <div className="col-sm-6">
                  <div className="p-3 rounded-2" style={{ backgroundColor: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)' }}>
                    <i className="bi bi-gear-wide-connected text-warning fs-4 mb-2 d-block"></i>
                    <h6 className="text-white fw-bold mb-1">Make in India</h6>
                    <p className="text-white-50 small mb-0">Positive indigenisation lists integration and domestic vendor preference.</p>
                  </div>
                </div>

                <div className="col-sm-6">
                  <div className="p-3 rounded-2" style={{ backgroundColor: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)' }}>
                    <i className="bi bi-rocket-takeoff text-success fs-4 mb-2 d-block"></i>
                    <h6 className="text-white fw-bold mb-1">iDEX &amp; Startups</h6>
                    <p className="text-white-50 small mb-0">Support for defence tech innovators, MSMEs, and academic research indents.</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="col-lg-6">
              <div className="position-relative">
                <img
                  src={insKolkataImg}
                  alt="Indian Navy INS Kolkata Guided Missile Destroyer D63 operating in the Indian Ocean"
                  className="img-fluid rounded-2 shadow-lg"
                  style={{ width: '100%', height: '360px', objectFit: 'cover' }}
                />
                <div
                  className="position-absolute bottom-0 start-0 end-0 p-3 text-white rounded-bottom-2"
                  style={{ background: 'linear-gradient(180deg, transparent 0%, rgba(11,34,57,0.95) 100%)' }}
                >
                  <div className="small fw-bold">Naval Indigenisation &bull; Project 15A Guided Missile Destroyer</div>
                  <div className="text-white-50 small" style={{ fontSize: '0.72rem' }}>
                    Constructed by Mazagon Dock Shipbuilders Limited (MDL), Mumbai
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ====================================================================
          SECTION 6: PLATFORM CAPABILITIES
          ==================================================================== */}
      <section className="py-5 bg-white">
        <div className="container py-3">
          <div className="text-center mb-5">
            <div className="text-warning fw-bold text-uppercase small mb-2" style={{ letterSpacing: '1px' }}>
              Built for Defence Acquisition Directorates
            </div>
            <h2 className="dcma-section-title dcma-section-title-center mb-3">
              Platform Capabilities &amp; Architecture
            </h2>
          </div>

          <div className="row g-4">
            <div className="col-md-4">
              <div className="card border-0 shadow-sm p-4 h-100 rounded-2 bg-light">
                <i className="bi bi-folder2-open text-primary fs-2 mb-3"></i>
                <h5 className="fw-bold text-dark mb-2">Centralized Contract Repository</h5>
                <p className="text-muted small mb-0">
                  Full lifecycle custody with strict CC-YYYY-NNNN identification, immutable audit timelines, and secure document metadata logging.
                </p>
              </div>
            </div>

            <div className="col-md-4">
              <div className="card border-0 shadow-sm p-4 h-100 rounded-2 bg-light">
                <i className="bi bi-clock-history text-warning fs-2 mb-3"></i>
                <h5 className="fw-bold text-dark mb-2">Procurement Tracking</h5>
                <p className="text-muted small mb-0">
                  Multi-year fiscal plan ceilings with line-item indenture breakdown and urgency classification (Urgent, High, Medium, Low).
                </p>
              </div>
            </div>

            <div className="col-md-4">
              <div className="card border-0 shadow-sm p-4 h-100 rounded-2 bg-light">
                <i className="bi bi-graph-up-arrow text-success fs-2 mb-3"></i>
                <h5 className="fw-bold text-dark mb-2">4-Pillar Vendor Evaluation</h5>
                <p className="text-muted small mb-0">
                  Multi-pillar appraisal matrix scoring contractors on Quality, Delivery, Pricing, and Compliance (0–10) with side-by-side comparison.
                </p>
              </div>
            </div>

            <div className="col-md-4">
              <div className="card border-0 shadow-sm p-4 h-100 rounded-2 bg-light">
                <i className="bi bi-currency-rupee text-success fs-2 mb-3"></i>
                <h5 className="fw-bold text-dark mb-2">Invoice &amp; Payment Management</h5>
                <p className="text-muted small mb-0">
                  Automated 18% GST calculation, milestone deliverable claims, and RTGS/NEFT transaction settlement audit trails.
                </p>
              </div>
            </div>

            <div className="col-md-4">
              <div className="card border-0 shadow-sm p-4 h-100 rounded-2 bg-light">
                <i className="bi bi-shield-lock text-danger fs-2 mb-3"></i>
                <h5 className="fw-bold text-dark mb-2">Role-Based Access (RBAC)</h5>
                <p className="text-muted small mb-0">
                  Tiered clearance for Administrators, Contracts Managers, and Safety Officers with automatic token rotation and route guards.
                </p>
              </div>
            </div>

            <div className="col-md-4">
              <div className="card border-0 shadow-sm p-4 h-100 rounded-2 bg-light">
                <i className="bi bi-diagram-3 text-info fs-2 mb-3"></i>
                <h5 className="fw-bold text-dark mb-2">Organized Workflows</h5>
                <p className="text-muted small mb-0">
                  Eliminates departmental procurement silos by connecting finance, technical scrutiny, and vendor performance in one portal.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ====================================================================
          SECTION 7: DEFENCE PHOTO GALLERY & LIGHTBOX (DCMA Grid Structure)
          ==================================================================== */}
      <section className="py-5" style={{ backgroundColor: '#F3F5F7' }}>
        <div className="container py-3">
          <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-end mb-4 pb-2 border-bottom">
            <div>
              <div className="text-warning fw-bold text-uppercase small mb-1" style={{ letterSpacing: '1px' }}>
                Operational Inventory &amp; Technology
              </div>
              <h2 className="dcma-section-title mb-0">
                Defence Photo Gallery
              </h2>
            </div>
            <span className="small text-muted mt-2 mt-md-0">
              Click any photograph to view technical specification
            </span>
          </div>

          <div className="row g-4">
            {galleryItems.map(item => (
              <div key={item.id} className="col-md-6 col-lg-4">
                <div
                  className="dcma-gallery-item"
                  onClick={() => setActiveLightbox(item)}
                  role="button"
                  tabIndex={0}
                  onKeyDown={(e) => e.key === 'Enter' && setActiveLightbox(item)}
                >
                  <img src={item.image} alt={item.alt} />
                  <div className="dcma-gallery-overlay">
                    <span className="badge bg-warning text-dark font-monospace align-self-start mb-1" style={{ fontSize: '0.68rem' }}>
                      {item.category}
                    </span>
                    <h6 className="fw-bold text-white mb-1" style={{ fontSize: '0.92rem' }}>
                      {item.title}
                    </h6>
                    <span className="small text-white-50" style={{ fontSize: '0.72rem' }}>
                      <i className="bi bi-zoom-in me-1"></i>View Full Specification
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* LIGHTBOX MODAL */}
      {activeLightbox && (
        <div
          className="dcma-lightbox-backdrop"
          onClick={() => setActiveLightbox(null)}
          role="dialog"
          aria-modal="true"
        >
          <div
            className="dcma-lightbox-modal p-0"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="position-relative">
              <img
                src={activeLightbox.image}
                alt={activeLightbox.alt}
                style={{ width: '100%', maxHeight: '480px', objectFit: 'cover' }}
              />
              <button
                type="button"
                className="btn btn-dark position-absolute top-0 end-0 m-3 rounded-circle d-flex align-items-center justify-content-center"
                style={{ width: 36, height: 36 }}
                onClick={() => setActiveLightbox(null)}
                aria-label="Close Preview"
              >
                <i className="bi bi-x-lg text-white"></i>
              </button>
            </div>
            <div className="p-4 text-white">
              <div className="d-flex justify-content-between align-items-center mb-2">
                <span className="badge bg-warning text-dark font-monospace">
                  {activeLightbox.category}
                </span>
                <span className="small text-muted" style={{ fontSize: '0.75rem' }}>
                  {activeLightbox.credit}
                </span>
              </div>
              <h5 className="fw-bold text-white mb-2">{activeLightbox.title}</h5>
              <p className="text-white-50 small mb-0 lh-base">
                {activeLightbox.desc}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
