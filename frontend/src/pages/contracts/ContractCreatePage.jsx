import { useState, useEffect } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { createContract } from '../../api/contractApi.js'
import { getVendors } from '../../api/vendorApi.js'
import { formatINR } from '../../utils/formatters.js'

export default function ContractCreatePage() {
  const navigate = useNavigate()

  // Form state
  const [form, setForm] = useState({
    contract_number: '',
    title: '',
    contract_type: 'Supply',
    vendor: '',
    value: '',
    start_date: '',
    end_date: '',
    status: 'Draft',
    description: '',
  })

  const [vendors, setVendors] = useState([])
  const [vendorsLoading, setVendorsLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')
  const [fieldErrors, setFieldErrors] = useState({})

  // Load vendors for select dropdown
  useEffect(() => {
    getVendors({ page_size: 100 })
      .then(res => {
        const list = res.data?.data?.results || res.data?.results || res.data?.data || []
        setVendors(list)
      })
      .catch(() => {})
      .finally(() => setVendorsLoading(false))
  }, [])

  const handleChange = (e) => {
    const { name, value } = e.target
    setForm(prev => ({ ...prev, [name]: value }))
    if (fieldErrors[name]) {
      setFieldErrors(prev => ({ ...prev, [name]: null }))
    }
    if (error) setError('')
  }

  // Quick format generator
  const handleAutoGenerateNumber = () => {
    const year = 2026
    const randomNum = String(Math.floor(Math.random() * 9000) + 1000)
    setForm(prev => ({ ...prev, contract_number: `CC-${year}-${randomNum}` }))
  }

  const validate = () => {
    const errs = {}
    const contractNumPattern = /^CC-\d{4}-\d{4}$/

    if (!form.contract_number.trim()) {
      errs.contract_number = 'Contract number is required.'
    } else if (!contractNumPattern.test(form.contract_number.trim())) {
      errs.contract_number = 'Format must be CC-YYYY-NNNN (e.g., CC-2026-0001).'
    }

    if (!form.title.trim()) {
      errs.title = 'Contract title is required.'
    }

    if (!form.value || parseFloat(form.value) <= 0) {
      errs.value = 'Contract value must be greater than zero.'
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
        contract_number: form.contract_number.trim(),
        title: form.title.trim(),
        value: parseFloat(form.value),
        vendor: form.vendor ? parseInt(form.vendor, 10) : null,
      }
      const res = await createContract(payload)
      const created = res.data?.data ?? res.data
      navigate(created?.id ? `/app/contracts/${created.id}` : '/app/contracts')
    } catch (err) {
      const data = err.response?.data
      if (data?.errors) {
        setFieldErrors(data.errors)
      } else if (data?.message) {
        setError(data.message)
      } else {
        setError('Failed to register contract. Please verify input fields.')
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
            <h4 className="fw-bold mb-0" style={{ color: '#102A43' }}>Register Defence Contract</h4>
            <span className="badge bg-secondary" style={{ fontSize: '0.7rem' }}>NEW ENTRY</span>
          </div>
          <p className="text-muted small mb-0">
            Formally register a defence procurement contract, execution schedule, and financial commitments.
          </p>
        </div>
        <Link to="/app/contracts" className="btn btn-outline-secondary btn-sm">
          <i className="bi bi-arrow-left me-1"></i>Back to Repository
        </Link>
      </div>

      {/* Global Error Banner */}
      {error && (
        <div className="alert alert-danger d-flex align-items-center gap-2 small mb-4 shadow-sm" role="alert">
          <i className="bi bi-exclamation-triangle-fill text-danger flex-shrink-0"></i>
          <span>{error}</span>
        </div>
      )}

      {/* Main Registration Form */}
      <form onSubmit={handleSubmit} noValidate>
        <div className="card border-0 shadow-sm p-4 rounded-3 bg-white mb-4">
          <h6 className="fw-bold pb-2 mb-3 border-bottom text-uppercase small" style={{ color: '#102A43', letterSpacing: '0.5px' }}>
            <i className="bi bi-shield-check text-warning me-2"></i>1. Core Identification &amp; Classification
          </h6>

          <div className="row g-3">
            {/* Contract Number */}
            <div className="col-md-6">
              <label className="form-label fw-semibold small" style={{ color: '#334E68' }}>
                Contract Number <span className="text-danger">*</span>
              </label>
              <div className="input-group">
                <input
                  type="text"
                  name="contract_number"
                  className={`form-control font-monospace ${fieldErrors.contract_number ? 'is-invalid' : ''}`}
                  placeholder="CC-YYYY-NNNN"
                  value={form.contract_number}
                  onChange={handleChange}
                  required
                />
                <button
                  type="button"
                  className="btn btn-outline-secondary btn-sm"
                  onClick={handleAutoGenerateNumber}
                  title="Generate valid identifier"
                >
                  <i className="bi bi-magic me-1"></i>Auto
                </button>
                {fieldErrors.contract_number && (
                  <div className="invalid-feedback d-block">{fieldErrors.contract_number}</div>
                )}
              </div>
              <small className="text-muted" style={{ fontSize: '0.72rem' }}>
                Standard Defence Acquisition format: CC-YYYY-NNNN (e.g., CC-2026-0001)
              </small>
            </div>

            {/* Contract Type */}
            <div className="col-md-6">
              <label className="form-label fw-semibold small" style={{ color: '#334E68' }}>
                Contract Type <span className="text-danger">*</span>
              </label>
              <select
                name="contract_type"
                className="form-select"
                value={form.contract_type}
                onChange={handleChange}
                required
              >
                <option value="Supply">Supply — Hardware, Munitions &amp; Tactical Equipment</option>
                <option value="Service">Service — IT, Logistics &amp; Security Services</option>
                <option value="Maintenance">Maintenance — Fleet, Avionics &amp; Weapon System MRO</option>
                <option value="Research">Research — R&amp;D, Prototyping &amp; iDEX Innovations</option>
                <option value="Consulting">Consulting — Technical Advisory &amp; System Audits</option>
              </select>
            </div>

            {/* Contract Title */}
            <div className="col-12">
              <label className="form-label fw-semibold small" style={{ color: '#334E68' }}>
                Contract Title <span className="text-danger">*</span>
              </label>
              <input
                type="text"
                name="title"
                className={`form-control ${fieldErrors.title ? 'is-invalid' : ''}`}
                placeholder="e.g., Supply of Tactical Software Defined Radios (SDR) for Armoured Regiments"
                value={form.title}
                onChange={handleChange}
                required
              />
              {fieldErrors.title && <div className="invalid-feedback">{fieldErrors.title}</div>}
            </div>

            {/* Vendor / Supplier */}
            <div className="col-md-8">
              <label className="form-label fw-semibold small" style={{ color: '#334E68' }}>
                Prime Contractor / Vendor
              </label>
              <select
                name="vendor"
                className="form-select"
                value={form.vendor}
                onChange={handleChange}
                disabled={vendorsLoading}
              >
                <option value="">Select registered defence supplier (optional)...</option>
                {vendors.map(v => (
                  <option key={v.id} value={v.id}>
                    {v.company_name} ({v.vendor_code} &bull; {v.category || 'General'})
                  </option>
                ))}
              </select>
              <small className="text-muted" style={{ fontSize: '0.72rem' }}>
                Suppliers registered in the Vendor Management Directory
              </small>
            </div>

            {/* Initial Status */}
            <div className="col-md-4">
              <label className="form-label fw-semibold small" style={{ color: '#334E68' }}>
                Lifecycle Status
              </label>
              <select
                name="status"
                className="form-select"
                value={form.status}
                onChange={handleChange}
              >
                <option value="Draft">Draft (Under Review)</option>
                <option value="Active">Active (In Execution)</option>
                <option value="Completed">Completed</option>
                <option value="Terminated">Terminated</option>
                <option value="Expired">Expired</option>
              </select>
            </div>
          </div>
        </div>

        {/* Financial & Schedule Card */}
        <div className="card border-0 shadow-sm p-4 rounded-3 bg-white mb-4">
          <h6 className="fw-bold pb-2 mb-3 border-bottom text-uppercase small" style={{ color: '#102A43', letterSpacing: '0.5px' }}>
            <i className="bi bi-currency-rupee text-warning me-2"></i>2. Financial Valuation &amp; Execution Timeline
          </h6>

          <div className="row g-3">
            {/* Value */}
            <div className="col-md-6">
              <label className="form-label fw-semibold small" style={{ color: '#334E68' }}>
                Total Contract Value (INR &#8377;) <span className="text-danger">*</span>
              </label>
              <div className="input-group">
                <span className="input-group-text bg-light">&#8377;</span>
                <input
                  type="number"
                  step="0.01"
                  min="0"
                  name="value"
                  className={`form-control font-monospace ${fieldErrors.value ? 'is-invalid' : ''}`}
                  placeholder="0.00"
                  value={form.value}
                  onChange={handleChange}
                  required
                />
                {fieldErrors.value && <div className="invalid-feedback">{fieldErrors.value}</div>}
              </div>
              <small className="text-muted" style={{ fontSize: '0.72rem' }}>
                Preview: {form.value && !isNaN(form.value) ? formatINR(form.value) : '&#8377;0.00'}
              </small>
            </div>

            <div className="col-md-3">
              <label className="form-label fw-semibold small" style={{ color: '#334E68' }}>
                Effective Start Date <span className="text-danger">*</span>
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
                Completion / End Date <span className="text-danger">*</span>
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

            {/* Description / Scope */}
            <div className="col-12">
              <label className="form-label fw-semibold small" style={{ color: '#334E68' }}>
                Scope of Work, Specifications &amp; Deliverables
              </label>
              <textarea
                name="description"
                rows="4"
                className="form-control"
                placeholder="Detail technical requirements, warranty specifications, milestone delivery terms, DAP compliance clauses, etc."
                value={form.description}
                onChange={handleChange}
              ></textarea>
            </div>
          </div>
        </div>

        {/* Action Controls */}
        <div className="d-flex justify-content-end gap-3 mb-5">
          <Link to="/app/contracts" className="btn btn-outline-secondary px-4">
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
                <span>Saving to Ledger...</span>
              </>
            ) : (
              <>
                <i className="bi bi-check-circle-fill text-warning"></i>
                <span>Register &amp; Save Contract</span>
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  )
}
