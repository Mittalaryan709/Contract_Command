import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { createPlan } from '../../api/procurementApi.js'
import { formatINR } from '../../utils/formatters.js'

export default function PlanCreatePage() {
  const navigate = useNavigate()

  const [form, setForm] = useState({
    plan_number: '',
    title: '',
    fiscal_year: '2026-2027',
    total_budget: '',
    start_date: '2026-04-01',
    end_date: '2027-03-31',
    status: 'Draft',
    description: '',
  })

  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')
  const [fieldErrors, setFieldErrors] = useState({})

  const handleChange = (e) => {
    const { name, value } = e.target
    setForm(prev => ({ ...prev, [name]: value }))
    if (fieldErrors[name]) {
      setFieldErrors(prev => ({ ...prev, [name]: null }))
    }
    if (error) setError('')
  }

  const handleAutoGenerateNumber = () => {
    const randomNum = String(Math.floor(Math.random() * 900) + 100)
    setForm(prev => ({ ...prev, plan_number: `PP-2026-${randomNum}` }))
  }

  const validate = () => {
    const errs = {}

    if (!form.plan_number.trim()) {
      errs.plan_number = 'Plan number is required.'
    }

    if (!form.title.trim()) {
      errs.title = 'Plan title is required.'
    }

    if (!form.fiscal_year.trim()) {
      errs.fiscal_year = 'Fiscal year is required.'
    } else if (!/^\d{4}-\d{4}$/.test(form.fiscal_year.trim())) {
      errs.fiscal_year = 'Fiscal year must be in format YYYY-YYYY (e.g. 2026-2027).'
    }

    if (!form.total_budget || parseFloat(form.total_budget) <= 0) {
      errs.total_budget = 'Total budget must be greater than zero.'
    }

    if (!form.start_date) {
      errs.start_date = 'Start date is required.'
    }

    if (!form.end_date) {
      errs.end_date = 'End date is required.'
    } else if (form.start_date && form.end_date <= form.start_date) {
      errs.end_date = 'End date must be strictly after start date.'
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
        ...form,
        plan_number: form.plan_number.trim(),
        title: form.title.trim(),
        fiscal_year: form.fiscal_year.trim(),
        total_budget: parseFloat(form.total_budget),
      }
      const res = await createPlan(payload)
      const created = res.data?.data ?? res.data
      navigate(created?.id ? `/app/procurement/plans/${created.id}` : '/app/procurement/plans')
    } catch (err) {
      const data = err.response?.data
      if (data?.errors) {
        setFieldErrors(data.errors)
      } else if (data?.message) {
        setError(data.message)
      } else {
        setError('Failed to create procurement plan. Please check your inputs.')
      }
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="container-fluid p-0" style={{ maxWidth: '960px' }}>
      {/* Header */}
      <div className="d-flex align-items-center justify-content-between mb-4 pb-2 border-bottom">
        <div>
          <div className="d-flex align-items-center gap-2 mb-1">
            <h4 className="fw-bold mb-0" style={{ color: '#102A43' }}>Create Procurement Master Plan</h4>
            <span className="badge bg-secondary" style={{ fontSize: '0.7rem' }}>NEW PLAN</span>
          </div>
          <p className="text-muted small mb-0">
            Establish a fiscal capability program, allocate budget ceilings, and coordinate requisition limits.
          </p>
        </div>
        <Link to="/app/procurement/plans" className="btn btn-outline-secondary btn-sm">
          <i className="bi bi-arrow-left me-1"></i>Back to Plans
        </Link>
      </div>

      {/* Global Error Banner */}
      {error && (
        <div className="alert alert-danger d-flex align-items-center gap-2 small mb-4 shadow-sm" role="alert">
          <i className="bi bi-exclamation-triangle-fill text-danger flex-shrink-0"></i>
          <span>{error}</span>
        </div>
      )}

      {/* Form */}
      <form onSubmit={handleSubmit} noValidate>
        <div className="card border-0 shadow-sm p-4 rounded-3 bg-white mb-4">
          <h6 className="fw-bold pb-2 mb-3 border-bottom text-uppercase small" style={{ color: '#102A43', letterSpacing: '0.5px' }}>
            <i className="bi bi-clipboard-data text-warning me-2"></i>1. Plan Identification &amp; Fiscal Mandate
          </h6>

          <div className="row g-3">
            {/* Plan Number */}
            <div className="col-md-6">
              <label className="form-label fw-semibold small" style={{ color: '#334E68' }}>
                Plan Number <span className="text-danger">*</span>
              </label>
              <div className="input-group">
                <input
                  type="text"
                  name="plan_number"
                  className={`form-control font-monospace ${fieldErrors.plan_number ? 'is-invalid' : ''}`}
                  placeholder="e.g. PP-2026-001"
                  value={form.plan_number}
                  onChange={handleChange}
                  required
                />
                <button
                  type="button"
                  className="btn btn-outline-secondary btn-sm"
                  onClick={handleAutoGenerateNumber}
                  title="Generate Plan Identifier"
                >
                  <i className="bi bi-magic me-1"></i>Auto
                </button>
                {fieldErrors.plan_number && (
                  <div className="invalid-feedback d-block">{fieldErrors.plan_number}</div>
                )}
              </div>
            </div>

            {/* Fiscal Year */}
            <div className="col-md-3">
              <label className="form-label fw-semibold small" style={{ color: '#334E68' }}>
                Fiscal Year <span className="text-danger">*</span>
              </label>
              <input
                type="text"
                name="fiscal_year"
                className={`form-control font-monospace ${fieldErrors.fiscal_year ? 'is-invalid' : ''}`}
                placeholder="2026-2027"
                value={form.fiscal_year}
                onChange={handleChange}
                required
              />
              {fieldErrors.fiscal_year && <div className="invalid-feedback">{fieldErrors.fiscal_year}</div>}
            </div>

            {/* Initial Status */}
            <div className="col-md-3">
              <label className="form-label fw-semibold small" style={{ color: '#334E68' }}>
                Lifecycle Status
              </label>
              <select
                name="status"
                className="form-select"
                value={form.status}
                onChange={handleChange}
              >
                <option value="Draft">Draft (Planning)</option>
                <option value="Approved">Approved (Sanctioned)</option>
                <option value="Active">Active (Open for Requisitions)</option>
                <option value="Closed">Closed</option>
              </select>
            </div>

            {/* Title */}
            <div className="col-12">
              <label className="form-label fw-semibold small" style={{ color: '#334E68' }}>
                Procurement Plan Title <span className="text-danger">*</span>
              </label>
              <input
                type="text"
                name="title"
                className={`form-control ${fieldErrors.title ? 'is-invalid' : ''}`}
                placeholder="e.g., FY2026-27 Armoured Corps Communication Modernization Plan"
                value={form.title}
                onChange={handleChange}
                required
              />
              {fieldErrors.title && <div className="invalid-feedback">{fieldErrors.title}</div>}
            </div>
          </div>
        </div>

        {/* Financial Ceiling & Execution Window */}
        <div className="card border-0 shadow-sm p-4 rounded-3 bg-white mb-4">
          <h6 className="fw-bold pb-2 mb-3 border-bottom text-uppercase small" style={{ color: '#102A43', letterSpacing: '0.5px' }}>
            <i className="bi bi-currency-rupee text-warning me-2"></i>2. Budget Allocation &amp; Schedule
          </h6>

          <div className="row g-3">
            {/* Total Budget */}
            <div className="col-md-6">
              <label className="form-label fw-semibold small" style={{ color: '#334E68' }}>
                Total Budget Ceiling (INR &#8377;) <span className="text-danger">*</span>
              </label>
              <div className="input-group">
                <span className="input-group-text bg-light">&#8377;</span>
                <input
                  type="number"
                  step="0.01"
                  min="0"
                  name="total_budget"
                  className={`form-control font-monospace ${fieldErrors.total_budget ? 'is-invalid' : ''}`}
                  placeholder="0.00"
                  value={form.total_budget}
                  onChange={handleChange}
                  required
                />
                {fieldErrors.total_budget && <div className="invalid-feedback">{fieldErrors.total_budget}</div>}
              </div>
              <small className="text-muted" style={{ fontSize: '0.72rem' }}>
                Preview: {form.total_budget && !isNaN(form.total_budget) ? formatINR(form.total_budget) : '&#8377;0.00'}
              </small>
            </div>

            {/* Start Date */}
            <div className="col-md-3">
              <label className="form-label fw-semibold small" style={{ color: '#334E68' }}>
                Execution Start Date <span className="text-danger">*</span>
              </label>
              <input
                type="date"
                name="start_date"
                className={`form-control ${fieldErrors.start_date ? 'is-invalid' : ''}`}
                value={form.start_date}
                onChange={handleChange}
                required
              />
              {fieldErrors.start_date && <div className="invalid-feedback">{fieldErrors.start_date}</div>}
            </div>

            {/* End Date */}
            <div className="col-md-3">
              <label className="form-label fw-semibold small" style={{ color: '#334E68' }}>
                Execution End Date <span className="text-danger">*</span>
              </label>
              <input
                type="date"
                name="end_date"
                className={`form-control ${fieldErrors.end_date ? 'is-invalid' : ''}`}
                value={form.end_date}
                onChange={handleChange}
                required
              />
              {fieldErrors.end_date && <div className="invalid-feedback">{fieldErrors.end_date}</div>}
            </div>

            {/* Description */}
            <div className="col-12">
              <label className="form-label fw-semibold small" style={{ color: '#334E68' }}>
                Program Strategic Objectives &amp; Defence Mandate
              </label>
              <textarea
                name="description"
                rows="4"
                className="form-control"
                placeholder="Describe operational objectives, procurement categories (Capital/Revenue), alignment with DAP 2020 Make-in-India mandates, etc."
                value={form.description}
                onChange={handleChange}
              ></textarea>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="d-flex justify-content-end gap-3 mb-5">
          <Link to="/app/procurement/plans" className="btn btn-outline-secondary px-4">
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
                <span>Saving Plan...</span>
              </>
            ) : (
              <>
                <i className="bi bi-check-circle-fill text-warning"></i>
                <span>Save Procurement Plan</span>
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  )
}
