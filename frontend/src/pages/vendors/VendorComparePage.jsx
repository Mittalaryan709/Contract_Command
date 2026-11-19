import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { getVendors } from '../../api/vendorApi.js'
import StatusBadge from '../../components/common/StatusBadge.jsx'
import LoadingSpinner from '../../components/common/LoadingSpinner.jsx'

export default function VendorComparePage() {
  const [vendors, setVendors] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  // Selected vendor IDs for comparison
  const [selectedIds, setSelectedIds] = useState(['', '', ''])

  useEffect(() => {
    getVendors({ page_size: 100 })
      .then(res => {
        const list = res.data?.data?.results || res.data?.results || res.data?.data || []
        setVendors(list)
        if (list.length >= 2) {
          setSelectedIds([String(list[0].id), String(list[1].id), list.length >= 3 ? String(list[2].id) : ''])
        } else if (list.length === 1) {
          setSelectedIds([String(list[0].id), '', ''])
        }
      })
      .catch(err => {
        setError(err.response?.data?.message || 'Failed to load vendors list for comparison.')
      })
      .finally(() => {
        setLoading(false)
      })
  }, [])

  const handleSelectVendor = (index, value) => {
    setSelectedIds(prev => {
      const updated = [...prev]
      updated[index] = value
      return updated
    })
  }

  if (loading) {
    return (
      <div className="py-5">
        <LoadingSpinner text="Loading supplier evaluation matrix..." />
      </div>
    )
  }

  const comparedVendors = selectedIds.map(id => vendors.find(v => String(v.id) === String(id)) || null)

  const getPillarScore = (vendor, pillar) => {
    if (!vendor) return 0
    if (vendor.evaluations && vendor.evaluations.length > 0) {
      const latest = vendor.evaluations[vendor.evaluations.length - 1]
      return parseFloat(latest[pillar]) || 0
    }
    // Fallback if average score is stored directly
    return parseFloat(vendor.average_score) || 0
  }

  return (
    <div className="container-fluid p-0">
      {/* Header */}
      <div className="d-flex flex-column flex-sm-row justify-content-between align-items-sm-center gap-3 mb-4 pb-2 border-bottom">
        <div>
          <div className="d-flex align-items-center gap-2 mb-1">
            <h4 className="fw-bold mb-0" style={{ color: '#102A43' }}>
              Supplier Comparison &amp; 4-Pillar Evaluation Matrix
            </h4>
            <span className="badge bg-secondary" style={{ fontSize: '0.7rem' }}>MODULE 3</span>
          </div>
          <p className="text-muted small mb-0">
            Side-by-side technical, financial, and compliance benchmark of empanelled defence contractors.
          </p>
        </div>

        <Link to="/app/vendors" className="btn btn-outline-secondary btn-sm d-flex align-items-center gap-1">
          <i className="bi bi-arrow-left"></i>
          <span>Back to Directory</span>
        </Link>
      </div>

      {error && (
        <div className="alert alert-danger small mb-4">
          <i className="bi bi-exclamation-triangle-fill me-2"></i>
          {error}
        </div>
      )}

      {/* Selector Toolbar */}
      <div className="card border-0 shadow-sm p-3 mb-4 rounded-3 bg-white">
        <div className="row g-3 align-items-center">
          <div className="col-12 mb-1">
            <span className="small fw-bold text-uppercase text-secondary" style={{ fontSize: '0.75rem', letterSpacing: '0.5px' }}>
              Select Suppliers to Compare (Up to 3):
            </span>
          </div>
          {[0, 1, 2].map(idx => (
            <div key={idx} className="col-md-4">
              <label htmlFor={`vendor-select-${idx}`} className="form-label small text-muted mb-1">
                Supplier {idx + 1}
              </label>
              <select
                id={`vendor-select-${idx}`}
                className="form-select form-select-sm"
                value={selectedIds[idx]}
                onChange={(e) => handleSelectVendor(idx, e.target.value)}
              >
                <option value="">-- Choose Supplier --</option>
                {vendors.map(v => (
                  <option key={v.id} value={v.id}>
                    {v.company_name} ({v.vendor_code || `ID: ${v.id}`})
                  </option>
                ))}
              </select>
            </div>
          ))}
        </div>
      </div>

      {/* Comparison Matrix Table */}
      <div className="card border-0 shadow-sm rounded-3 bg-white overflow-hidden mb-4">
        <div className="table-responsive">
          <table className="table table-bordered align-middle mb-0">
            <thead className="table-light">
              <tr>
                <th style={{ width: '25%' }} className="text-secondary small text-uppercase">Evaluation Metric</th>
                {[0, 1, 2].map(idx => {
                  const v = comparedVendors[idx]
                  return (
                    <th key={idx} style={{ width: '25%' }} className="text-center">
                      {v ? (
                        <div>
                          <div className="fw-bold text-dark">{v.company_name}</div>
                          <div className="text-muted small font-monospace">{v.vendor_code}</div>
                        </div>
                      ) : (
                        <span className="text-muted small fst-italic">No Supplier Selected</span>
                      )}
                    </th>
                  )
                })}
              </tr>
            </thead>
            <tbody>
              {/* Category */}
              <tr>
                <td className="fw-semibold text-secondary small">Sector / Domain</td>
                {[0, 1, 2].map(idx => (
                  <td key={idx} className="text-center small">
                    {comparedVendors[idx] ? comparedVendors[idx].category : '—'}
                  </td>
                ))}
              </tr>

              {/* Status */}
              <tr>
                <td className="fw-semibold text-secondary small">Empanelment Status</td>
                {[0, 1, 2].map(idx => (
                  <td key={idx} className="text-center">
                    {comparedVendors[idx] ? <StatusBadge status={comparedVendors[idx].status} /> : '—'}
                  </td>
                ))}
              </tr>

              {/* Overall Score */}
              <tr className="table-active">
                <td className="fw-bold text-dark">
                  Overall Composite Score (/10)
                </td>
                {[0, 1, 2].map(idx => {
                  const v = comparedVendors[idx]
                  if (!v) return <td key={idx} className="text-center">—</td>
                  const score = parseFloat(v.average_score) || 0
                  return (
                    <td key={idx} className="text-center">
                      <span className="h4 fw-bold mb-0 text-primary">{score > 0 ? score.toFixed(1) : 'N/A'}</span>
                      <span className="text-muted small"> / 10</span>
                    </td>
                  )
                })}
              </tr>

              {/* Pillar 1: Quality */}
              <tr>
                <td className="small">
                  <strong>Pillar 1: Quality &amp; Reliability</strong>
                  <div className="text-muted" style={{ fontSize: '0.72rem' }}>Milestone acceptance, defect density, QA audit</div>
                </td>
                {[0, 1, 2].map(idx => {
                  const v = comparedVendors[idx]
                  const q = getPillarScore(v, 'quality_score')
                  return (
                    <td key={idx} className="text-center fw-semibold">
                      {v ? `${q > 0 ? q.toFixed(1) : '—'} / 10` : '—'}
                    </td>
                  )
                })}
              </tr>

              {/* Pillar 2: Delivery */}
              <tr>
                <td className="small">
                  <strong>Pillar 2: Delivery &amp; Timeliness</strong>
                  <div className="text-muted" style={{ fontSize: '0.72rem' }}>On-time dispatch, schedule adherence</div>
                </td>
                {[0, 1, 2].map(idx => {
                  const v = comparedVendors[idx]
                  const d = getPillarScore(v, 'delivery_score')
                  return (
                    <td key={idx} className="text-center fw-semibold">
                      {v ? `${d > 0 ? d.toFixed(1) : '—'} / 10` : '—'}
                    </td>
                  )
                })}
              </tr>

              {/* Pillar 3: Pricing */}
              <tr>
                <td className="small">
                  <strong>Pillar 3: Pricing &amp; Commercial</strong>
                  <div className="text-muted" style={{ fontSize: '0.72rem' }}>Cost competitiveness, billing transparency</div>
                </td>
                {[0, 1, 2].map(idx => {
                  const v = comparedVendors[idx]
                  const p = getPillarScore(v, 'pricing_score')
                  return (
                    <td key={idx} className="text-center fw-semibold">
                      {v ? `${p > 0 ? p.toFixed(1) : '—'} / 10` : '—'}
                    </td>
                  )
                })}
              </tr>

              {/* Pillar 4: Compliance */}
              <tr>
                <td className="small">
                  <strong>Pillar 4: Statutory &amp; Security Compliance</strong>
                  <div className="text-muted" style={{ fontSize: '0.72rem' }}>Security vetting, GST compliance, ISO certifications</div>
                </td>
                {[0, 1, 2].map(idx => {
                  const v = comparedVendors[idx]
                  const c = getPillarScore(v, 'compliance_score')
                  return (
                    <td key={idx} className="text-center fw-semibold">
                      {v ? `${c > 0 ? c.toFixed(1) : '—'} / 10` : '—'}
                    </td>
                  )
                })}
              </tr>

              {/* Total Contracts */}
              <tr>
                <td className="fw-semibold text-secondary small">Awarded Contracts Count</td>
                {[0, 1, 2].map(idx => (
                  <td key={idx} className="text-center fw-bold">
                    {comparedVendors[idx] ? comparedVendors[idx].contracts_count ?? 0 : '—'}
                  </td>
                ))}
              </tr>

              {/* Location */}
              <tr>
                <td className="fw-semibold text-secondary small">Manufacturing Base / City</td>
                {[0, 1, 2].map(idx => (
                  <td key={idx} className="text-center small">
                    {comparedVendors[idx] ? `${comparedVendors[idx].city || ''}, ${comparedVendors[idx].state || ''}` : '—'}
                  </td>
                ))}
              </tr>

              {/* Statutory Tax ID */}
              <tr>
                <td className="fw-semibold text-secondary small">GSTIN / Tax Verification</td>
                {[0, 1, 2].map(idx => (
                  <td key={idx} className="text-center small font-monospace">
                    {comparedVendors[idx] ? comparedVendors[idx].gst_number || '—' : '—'}
                  </td>
                ))}
              </tr>

              {/* Direct Link Action */}
              <tr>
                <td className="fw-semibold text-secondary small">Dossier Actions</td>
                {[0, 1, 2].map(idx => {
                  const v = comparedVendors[idx]
                  if (!v) return <td key={idx} className="text-center">—</td>
                  return (
                    <td key={idx} className="text-center">
                      <div className="d-flex justify-content-center gap-1">
                        <Link to={`/app/vendors/${v.id}`} className="btn btn-outline-primary btn-sm py-1 px-2" style={{ fontSize: '0.75rem' }}>
                          View Dossier
                        </Link>
                        <Link to={`/app/vendors/${v.id}/evaluate`} className="btn btn-outline-success btn-sm py-1 px-2" style={{ fontSize: '0.75rem' }}>
                          Evaluate
                        </Link>
                      </div>
                    </td>
                  )
                })}
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
