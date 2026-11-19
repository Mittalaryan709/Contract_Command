import { useState, useEffect } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import { getVendor, createEvaluation } from '../../api/vendorApi.js'
import LoadingSpinner from '../../components/common/LoadingSpinner.jsx'

export default function VendorEvaluationPage() {
  const { id } = useParams()
  const navigate = useNavigate()

  const [vendor, setVendor] = useState(null)
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')
  const [fieldErrors, setFieldErrors] = useState({})

  const [form, setForm] = useState({
    evaluation_date: '2026-11-19',
    quality_score: '8.5',
    delivery_score: '8.0',
    pricing_score: '7.5',
    compliance_score: '9.0',
    recommendation: 'Selected',
    remarks: '',
  })

  useEffect(() => {
    let isMounted = true
    getVendor(id)
      .then(res => {
        if (!isMounted) return
        const v = res.data?.data ?? res.data
        setVendor(v)
      })
      .catch(err => {
        if (!isMounted) return
        setError(err.response?.data?.message || 'Unable to retrieve vendor details.')
      })
      .finally(() => {
        if (isMounted) setLoading(false)
      })

    return () => {
      isMounted = false
    }
  }, [id])

  const handleChange = (e) => {
    const { name, value } = e.target
    setForm(prev => ({ ...prev, [name]: value }))
    if (fieldErrors[name]) {
      setFieldErrors(prev => ({ ...prev, [name]: null }))
    }
    if (error) setError('')
  }

  // Calculate live average overall score
  const q = parseFloat(form.quality_score) || 0
  const d = parseFloat(form.delivery_score) || 0
  const p = parseFloat(form.pricing_score) || 0
  const c = parseFloat(form.compliance_score) || 0
  const computedOverall = ((q + d + p + c) / 4).toFixed(1)

  const validate = () => {
    const errs = {}

    if (!form.evaluation_date) {
      errs.evaluation_date = 'Evaluation date is required.'
    }

    const checkScore = (field, name) => {
      const val = parseFloat(form[field])
      if (isNaN(val) || val < 0 || val > 10) {
        errs[field] = `${name} must be between 0.0 and 10.0.`
      }
    }

    checkScore('quality_score', 'Quality score')
    checkScore('delivery_score', 'Delivery score')
    checkScore('pricing_score', 'Pricing score')
    checkScore('compliance_score', 'Compliance score')

    if (!form.recommendation) {
      errs.recommendation = 'Formal recommendation is required.'
    }

    setFieldErrors(errs)
    return Object.keys(errs).length === 0
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!validate()) return

    setSubmitting(true)
    setError('')
    try {
      const payload = {
        vendor: parseInt(id, 10),
        evaluation_date: form.evaluation_date,
        quality_score: parseFloat(form.quality_score),
        delivery_score: parseFloat(form.delivery_score),
        pricing_score: parseFloat(form.pricing_score),
        compliance_score: parseFloat(form.compliance_score),
        recommendation: form.recommendation,
        remarks: form.remarks.trim(),
      }
      await createEvaluation(payload)
      navigate(`/app/vendors/${id}`)
    } catch (err) {
      const data = err.response?.data
      if (data?.errors) {
        setFieldErrors(data.errors)
      } else if (data?.message) {
        setError(data.message)
      } else {
        setError('Failed to record evaluation audit. Please check score values.')
      }
    } finally {
      setSubmitting(false)
    }
  }

  if (loading) {
    return (
      <div className="p-5 text-center">
        <LoadingSpinner message="Loading Vendor Evaluation Matrix..." />
      </div>
    )
  }

  return (
    <div className="container-fluid p-0" style={{ maxWidth: '960px' }}>
      {/* Header */}
      <div className="d-flex align-items-center justify-content-between mb-4 pb-2 border-bottom">
        <div>
          <div className="d-flex align-items-center gap-2 mb-1">
            <h4 className="fw-bold mb-0" style={{ color: '#102A43' }}>DAP 2020 Vendor Performance Scorecard</h4>
            <span className="badge bg-warning text-dark" style={{ fontSize: '0.7rem' }}>AUDIT EVALUATION</span>
          </div>
          <p className="text-muted small mb-0">
            Formal assessment of {vendor?.company_name} ({vendor?.vendor_code}) across four core defence procurement pillars.
          </p>
        </div>
        <Link to={`/app/vendors/${id}`} className="btn btn-outline-secondary btn-sm">
          <i className="bi bi-arrow-left me-1"></i>Back to Dossier
        </Link>
      </div>

      {/* Global Error Banner */}
      {error && (
        <div className="alert alert-danger d-flex align-items-center gap-2 small mb-4 shadow-sm" role="alert">
          <i className="bi bi-exclamation-triangle-fill text-danger flex-shrink-0"></i>
          <span>{error}</span>
        </div>
      )}

      {/* Vendor Summary Card */}
      <div className="card border-0 shadow-sm p-3 mb-4 rounded-3 bg-white border-start border-4 border-primary">
        <div className="d-flex justify-content-between align-items-center flex-wrap gap-2">
          <div>
            <span className="text-muted small text-uppercase fw-semibold">Supplier Assessed:</span>
            <h5 className="fw-bold mb-0 text-dark">{vendor?.company_name}</h5>
            <span className="text-muted small">Category: {vendor?.category} &bull; Works: {vendor?.city}, {vendor?.state}</span>
          </div>
          <div className="text-end">
            <span className="text-muted small d-block">Vendor Code</span>
            <span className="font-monospace fw-bold text-primary">{vendor?.vendor_code}</span>
          </div>
        </div>
      </div>

      {/* Evaluation Form */}
      <form onSubmit={handleSubmit} noValidate>
        {/* Date and Overall Score preview */}
        <div className="card border-0 shadow-sm p-4 rounded-3 bg-white mb-4">
          <div className="row g-3 align-items-center">
            <div className="col-md-6">
              <label className="form-label fw-semibold small" style={{ color: '#334E68' }}>
                Evaluation / Audit Date <span className="text-danger">*</span>
              </label>
              <input
                type="date"
                name="evaluation_date"
                className={`form-control ${fieldErrors.evaluation_date ? 'is-invalid' : ''}`}
                value={form.evaluation_date}
                onChange={handleChange}
                required
              />
              {fieldErrors.evaluation_date && <div className="invalid-feedback">{fieldErrors.evaluation_date}</div>}
            </div>

            <div className="col-md-6 text-md-end">
              <div className="p-3 rounded-3 bg-light border d-inline-block text-start" style={{ minWidth: '220px' }}>
                <span className="text-muted small text-uppercase fw-semibold d-block">Overall 4-Pillar Score:</span>
                <span className="h3 fw-bold text-success font-monospace mb-0 d-block">
                  {computedOverall} <small className="fs-6 text-muted">/ 10.0</small>
                </span>
                <span className="text-muted" style={{ fontSize: '0.7rem' }}>Calculated average of 4 criteria</span>
              </div>
            </div>
          </div>
        </div>

        {/* 4 Pillars Scoring Card */}
        <div className="card border-0 shadow-sm p-4 rounded-3 bg-white mb-4">
          <h6 className="fw-bold pb-2 mb-3 border-bottom text-uppercase small" style={{ color: '#102A43', letterSpacing: '0.5px' }}>
            <i className="bi bi-award-fill text-warning me-2"></i>Four-Pillar Assessment Scores (0.0 to 10.0)
          </h6>

          <div className="row g-4">
            {/* 1. Quality */}
            <div className="col-md-6">
              <div className="p-3 border rounded-3 h-100 bg-light">
                <div className="d-flex justify-content-between align-items-center mb-1">
                  <label className="form-label fw-bold small mb-0 text-dark">
                    1. Quality &amp; Technical Conformity
                  </label>
                  <span className="badge bg-primary font-monospace">{form.quality_score}</span>
                </div>
                <p className="text-muted mb-2" style={{ fontSize: '0.74rem' }}>
                  Military specification adherence, factory acceptance testing, defect rate, and build durability.
                </p>
                <div className="input-group input-group-sm">
                  <input
                    type="range"
                    min="0"
                    max="10"
                    step="0.1"
                    name="quality_score"
                    className="form-range"
                    value={form.quality_score}
                    onChange={handleChange}
                  />
                </div>
                {fieldErrors.quality_score && (
                  <div className="text-danger small mt-1">{fieldErrors.quality_score}</div>
                )}
              </div>
            </div>

            {/* 2. Delivery */}
            <div className="col-md-6">
              <div className="p-3 border rounded-3 h-100 bg-light">
                <div className="d-flex justify-content-between align-items-center mb-1">
                  <label className="form-label fw-bold small mb-0 text-dark">
                    2. Timeliness &amp; Delivery Reliability
                  </label>
                  <span className="badge bg-primary font-monospace">{form.delivery_score}</span>
                </div>
                <p className="text-muted mb-2" style={{ fontSize: '0.74rem' }}>
                  Punctuality against contractual milestone delivery dates, supply chain lead time, and responsiveness.
                </p>
                <div className="input-group input-group-sm">
                  <input
                    type="range"
                    min="0"
                    max="10"
                    step="0.1"
                    name="delivery_score"
                    className="form-range"
                    value={form.delivery_score}
                    onChange={handleChange}
                  />
                </div>
                {fieldErrors.delivery_score && (
                  <div className="text-danger small mt-1">{fieldErrors.delivery_score}</div>
                )}
              </div>
            </div>

            {/* 3. Pricing */}
            <div className="col-md-6">
              <div className="p-3 border rounded-3 h-100 bg-light">
                <div className="d-flex justify-content-between align-items-center mb-1">
                  <label className="form-label fw-bold small mb-0 text-dark">
                    3. Pricing Competitiveness &amp; Billing
                  </label>
                  <span className="badge bg-primary font-monospace">{form.pricing_score}</span>
                </div>
                <p className="text-muted mb-2" style={{ fontSize: '0.74rem' }}>
                  Cost efficiency against benchmarks, transparent breakdown of GST and duties, invoice accuracy.
                </p>
                <div className="input-group input-group-sm">
                  <input
                    type="range"
                    min="0"
                    max="10"
                    step="0.1"
                    name="pricing_score"
                    className="form-range"
                    value={form.pricing_score}
                    onChange={handleChange}
                  />
                </div>
                {fieldErrors.pricing_score && (
                  <div className="text-danger small mt-1">{fieldErrors.pricing_score}</div>
                )}
              </div>
            </div>

            {/* 4. Compliance */}
            <div className="col-md-6">
              <div className="p-3 border rounded-3 h-100 bg-light">
                <div className="d-flex justify-content-between align-items-center mb-1">
                  <label className="form-label fw-bold small mb-0 text-dark">
                    4. Statutory Compliance &amp; Safety
                  </label>
                  <span className="badge bg-primary font-monospace">{form.compliance_score}</span>
                </div>
                <p className="text-muted mb-2" style={{ fontSize: '0.74rem' }}>
                  ISO certifications, indigenous content (IC) Make-in-India quota compliance, environmental safety.
                </p>
                <div className="input-group input-group-sm">
                  <input
                    type="range"
                    min="0"
                    max="10"
                    step="0.1"
                    name="compliance_score"
                    className="form-range"
                    value={form.compliance_score}
                    onChange={handleChange}
                  />
                </div>
                {fieldErrors.compliance_score && (
                  <div className="text-danger small mt-1">{fieldErrors.compliance_score}</div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Recommendation and Qualitative Remarks */}
        <div className="card border-0 shadow-sm p-4 rounded-3 bg-white mb-4">
          <h6 className="fw-bold pb-2 mb-3 border-bottom text-uppercase small" style={{ color: '#102A43', letterSpacing: '0.5px' }}>
            <i className="bi bi-check2-circle text-warning me-2"></i>Recommendation &amp; Audit Commentary
          </h6>

          <div className="row g-3">
            <div className="col-md-6">
              <label className="form-label fw-semibold small" style={{ color: '#334E68' }}>
                Evaluation Finding / Recommendation <span className="text-danger">*</span>
              </label>
              <select
                name="recommendation"
                className="form-select"
                value={form.recommendation}
                onChange={handleChange}
                required
              >
                <option value="Selected">Selected — Primary Vendor Recommendation</option>
                <option value="Shortlisted">Shortlisted — Qualified for Competitive Tender Stage</option>
                <option value="Rejected">Rejected — Unqualified / Technical Disqualification</option>
              </select>
            </div>

            <div className="col-12">
              <label className="form-label fw-semibold small" style={{ color: '#334E68' }}>
                Auditor Findings, Remarks &amp; Corrective Action Items
              </label>
              <textarea
                name="remarks"
                rows="4"
                className="form-control"
                placeholder="Detail specific observations, defect reports, factory visit impressions, or required vendor corrective actions."
                value={form.remarks}
                onChange={handleChange}
              ></textarea>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="d-flex justify-content-end gap-3 mb-5">
          <Link to={`/app/vendors/${id}`} className="btn btn-outline-secondary px-4">
            Cancel
          </Link>
          <button
            type="submit"
            className="btn btn-navy px-4 d-flex align-items-center gap-2 shadow-sm"
            disabled={submitting}
          >
            {submitting ? (
              <>
                <span className="spinner-border spinner-border-sm" role="status"></span>
                <span>Recording Scorecard...</span>
              </>
            ) : (
              <>
                <i className="bi bi-shield-check text-warning"></i>
                <span>Submit Performance Evaluation</span>
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  )
}
