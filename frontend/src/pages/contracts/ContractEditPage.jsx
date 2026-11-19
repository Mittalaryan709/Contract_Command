import { useState, useEffect } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import { getContract, updateContract } from '../../api/contractApi.js'
import { getVendors } from '../../api/vendorApi.js'
import LoadingSpinner from '../../components/common/LoadingSpinner.jsx'
import { formatINR } from '../../utils/formatters.js'

export default function ContractEditPage() {
  const { id } = useParams()
  const navigate = useNavigate()

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
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')
  const [fieldErrors, setFieldErrors] = useState({})

  // Fetch contract and vendors in parallel
  useEffect(() => {
    let isMounted = true

    Promise.all([
      getContract(id),
      getVendors({ page_size: 100 }),
    ])
      .then(([contractRes, vendorRes]) => {
        if (!isMounted) return
        const contractData = contractRes.data?.data ?? contractRes.data
        const vendorList = vendorRes.data?.data?.results || vendorRes.data?.results || vendorRes.data?.data || []

        setVendors(vendorList)
        setForm({
          contract_number: contractData.contract_number || '',
          title: contractData.title || '',
          contract_type: contractData.contract_type || 'Supply',
          vendor: contractData.vendor ? String(contractData.vendor) : '',
          value: contractData.value !== undefined ? String(contractData.value) : '',
          start_date: contractData.start_date || '',
          end_date: contractData.end_date || '',
          status: contractData.status || 'Draft',
          description: contractData.description || '',
        })
      })
      .catch((err) => {
        if (!isMounted) return
        setError(err.response?.data?.message || 'Unable to load contract dossier for editing.')
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
      await updateContract(id, payload)
      navigate(`/app/contracts/${id}`)
    } catch (err) {
      const data = err.response?.data
      if (data?.errors) {
        setFieldErrors(data.errors)
      } else if (data?.message) {
        setError(data.message)
      } else {
        setError('Failed to update contract. Please verify input fields.')
      }
    } finally {
      setSubmitting(false)
    }
  }

  if (loading) {
    return (
      <div className="p-5 text-center">
        <LoadingSpinner message="Retrieving Contract Record for Revision..." />
      </div>
    )
  }

  return (
    <div className="container-fluid p-0" style={{ maxWidth: '960px' }}>
      {/* Header */}
      <div className="d-flex align-items-center justify-content-between mb-4 pb-2 border-bottom">
        <div>
          <div className="d-flex align-items-center gap-2 mb-1">
            <h4 className="fw-bold mb-0" style={{ color: '#102A43' }}>Amend Defence Contract</h4>
            <span className="badge bg-primary" style={{ fontSize: '0.7rem' }}>EDITING #{id}</span>
          </div>
          <p className="text-muted small mb-0">
            Revise terms, financial valuation, vendor allocation, or execution status for {form.contract_number}.
          </p>
        </div>
        <Link to={`/app/contracts/${id}`} className="btn btn-outline-secondary btn-sm">
          <i className="bi bi-arrow-left me-1"></i>Cancel &amp; Return
        </Link>
      </div>

      {/* Global Error Alert */}
      {error && (
        <div className="alert alert-danger d-flex align-items-center gap-2 small mb-4 shadow-sm" role="alert">
          <i className="bi bi-exclamation-triangle-fill text-danger flex-shrink-0"></i>
          <span>{error}</span>
        </div>
      )}

      {/* Main Form */}
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
              <input
                type="text"
                name="contract_number"
                className={`form-control font-monospace ${fieldErrors.contract_number ? 'is-invalid' : ''}`}
                value={form.contract_number}
                onChange={handleChange}
                required
              />
              {fieldErrors.contract_number && (
                <div className="invalid-feedback">{fieldErrors.contract_number}</div>
              )}
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

            {/* Title */}
            <div className="col-12">
              <label className="form-label fw-semibold small" style={{ color: '#334E68' }}>
                Contract Title <span className="text-danger">*</span>
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

            {/* Vendor */}
            <div className="col-md-8">
              <label className="form-label fw-semibold small" style={{ color: '#334E68' }}>
                Prime Contractor / Vendor
              </label>
              <select
                name="vendor"
                className="form-select"
                value={form.vendor}
                onChange={handleChange}
              >
                <option value="">Select registered defence supplier (optional)...</option>
                {vendors.map(v => (
                  <option key={v.id} value={v.id}>
                    {v.company_name} ({v.vendor_code} &bull; {v.category || 'General'})
                  </option>
                ))}
              </select>
            </div>

            {/* Status */}
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
                <option value="Draft">Draft</option>
                <option value="Active">Active</option>
                <option value="Completed">Completed</option>
                <option value="Terminated">Terminated</option>
                <option value="Expired">Expired</option>
              </select>
            </div>
          </div>
        </div>

        {/* Financial & Schedule */}
        <div className="card border-0 shadow-sm p-4 rounded-3 bg-white mb-4">
          <h6 className="fw-bold pb-2 mb-3 border-bottom text-uppercase small" style={{ color: '#102A43', letterSpacing: '0.5px' }}>
            <i className="bi bi-currency-rupee text-warning me-2"></i>2. Financial Valuation &amp; Schedule
          </h6>

          <div className="row g-3">
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

            <div className="col-12">
              <label className="form-label fw-semibold small" style={{ color: '#334E68' }}>
                Scope of Work, Specifications &amp; Deliverables
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
          <Link to={`/app/contracts/${id}`} className="btn btn-outline-secondary px-4">
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
                <span>Saving Revisions...</span>
              </>
            ) : (
              <>
                <i className="bi bi-check-circle-fill text-warning"></i>
                <span>Update Contract Terms</span>
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  )
}
