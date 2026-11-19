import { useState, useEffect } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import { getPlan, updatePlan } from '../../api/procurementApi.js'
import LoadingSpinner from '../../components/common/LoadingSpinner.jsx'
import { formatINR } from '../../utils/formatters.js'

export default function PlanEditPage() {
  const { id } = useParams()
  const navigate = useNavigate()

  const [form, setForm] = useState({
    plan_number: '',
    title: '',
    fiscal_year: '',
    total_budget: '',
    start_date: '',
    end_date: '',
    status: 'Draft',
    description: '',
  })

  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')
  const [fieldErrors, setFieldErrors] = useState({})

  useEffect(() => {
    let isMounted = true
    getPlan(id)
      .then((res) => {
        if (!isMounted) return
        const p = res.data?.data ?? res.data
        setForm({
          plan_number: p.plan_number || '',
          title: p.title || '',
          fiscal_year: p.fiscal_year || '',
          total_budget: p.total_budget !== undefined ? String(p.total_budget) : '',
          start_date: p.start_date || '',
          end_date: p.end_date || '',
          status: p.status || 'Draft',
          description: p.description || '',
        })
      })
      .catch((err) => {
        if (!isMounted) return
        setError(err.response?.data?.message || 'Failed to retrieve procurement plan for editing.')
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
      await updatePlan(id, payload)
      navigate(`/app/procurement/plans/${id}`)
    } catch (err) {
      const data = err.response?.data
      if (data?.errors) {
        setFieldErrors(data.errors)
      } else if (data?.message) {
        setError(data.message)
      } else {
        setError('Failed to update procurement plan. Please check input parameters.')
      }
    } finally {
      setSubmitting(false)
    }
  }

  if (loading) {
    return (
      <div className="p-5 text-center">
        <LoadingSpinner message="Retrieving Procurement Plan for Revision..." />
      </div>
    )
  }

  return (
    <div className="container-fluid p-0" style={{ maxWidth: '960px' }}>
      {/* Header */}
      <div className="d-flex align-items-center justify-content-between mb-4 pb-2 border-bottom">
        <div>
          <div className="d-flex align-items-center gap-2 mb-1">
            <h4 className="fw-bold mb-0" style={{ color: '#102A43' }}>Amend Procurement Plan</h4>
            <span className="badge bg-primary" style={{ fontSize: '0.7rem' }}>EDITING #{id}</span>
          </div>
          <p className="text-muted small mb-0">
            Revise budget allocations, operational schedule, or status for {form.plan_number}.
          </p>
        </div>
        <Link to={`/app/procurement/plans/${id}`} className="btn btn-outline-secondary btn-sm">
          <i className="bi bi-arrow-left me-1"></i>Cancel &amp; Return
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
            <i className="bi bi-clipboard-data text-warning me-2"></i>1. Core Identification &amp; Fiscal Mandate
          </h6>

          <div className="row g-3">
            <div className="col-md-6">
              <label className="form-label fw-semibold small" style={{ color: '#334E68' }}>
                Plan Number <span className="text-danger">*</span>
              </label>
              <input
                type="text"
                name="plan_number"
                className={`form-control font-monospace ${fieldErrors.plan_number ? 'is-invalid' : ''}`}
                value={form.plan_number}
                onChange={handleChange}
                required
              />
              {fieldErrors.plan_number && <div className="invalid-feedback">{fieldErrors.plan_number}</div>}
            </div>

            <div className="col-md-3">
              <label className="form-label fw-semibold small" style={{ color: '#334E68' }}>
                Fiscal Year <span className="text-danger">*</span>
              </label>
              <input
                type="text"
                name="fiscal_year"
                className={`form-control font-monospace ${fieldErrors.fiscal_year ? 'is-invalid' : ''}`}
                value={form.fiscal_year}
                onChange={handleChange}
                required
              />
              {fieldErrors.fiscal_year && <div className="invalid-feedback">{fieldErrors.fiscal_year}</div>}
            </div>

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
                <option value="Draft">Draft</option>
                <option value="Approved">Approved</option>
                <option value="Active">Active</option>
                <option value="Closed">Closed</option>
              </select>
            </div>

            <div className="col-12">
              <label className="form-label fw-semibold small" style={{ color: '#334E68' }}>
                Procurement Plan Title <span className="text-danger">*</span>
              </label>
              <input
                type="text"
                name="title"
                className={`form-control ${fieldErrors.title ? 'is-invalid' : ''}`}
                value={form.title}
                onChange={handleChange}
                required
              />
              {fieldErrors.title && <div className="invalid-feedback">{fieldErrors.title}</div>}
            </div>
          </div>
        </div>

        {/* Budget Allocation & Execution Window */}
        <div className="card border-0 shadow-sm p-4 rounded-3 bg-white mb-4">
          <h6 className="fw-bold pb-2 mb-3 border-bottom text-uppercase small" style={{ color: '#102A43', letterSpacing: '0.5px' }}>
            <i className="bi bi-currency-rupee text-warning me-2"></i>2. Budget Allocation &amp; Schedule
          </h6>

          <div className="row g-3">
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

            <div className="col-12">
              <label className="form-label fw-semibold small" style={{ color: '#334E68' }}>
                Program Strategic Objectives &amp; Defence Mandate
              </label>
              <textarea
                name="description"
                rows="4"
                className="form-control"
                value={form.description}
                onChange={handleChange}
              ></textarea>
            </div>
          </div>
        </div>

        {/* Action Controls */}
        <div className="d-flex justify-content-end gap-3 mb-5">
          <Link to={`/app/procurement/plans/${id}`} className="btn btn-outline-secondary px-4">
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
                <span>Updating Plan...</span>
              </>
            ) : (
              <>
                <i className="bi bi-check-circle-fill text-warning"></i>
                <span>Update Procurement Plan</span>
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  )
}
