import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { createVendor } from '../../api/vendorApi.js'

export default function VendorCreatePage() {
  const navigate = useNavigate()

  const [form, setForm] = useState({
    vendor_code: '',
    company_name: '',
    category: 'Electronics',
    contact_person: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    state: '',
    pincode: '',
    gst_number: '',
    pan_number: '',
    status: 'Active',
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

  const handleAutoGenerateCode = () => {
    const randomNum = String(Math.floor(Math.random() * 9000) + 1000)
    setForm(prev => ({ ...prev, vendor_code: `VND-${randomNum}` }))
  }

  const validate = () => {
    const errs = {}

    if (!form.vendor_code.trim()) {
      errs.vendor_code = 'Vendor code is required.'
    }

    if (!form.company_name.trim()) {
      errs.company_name = 'Enterprise / Company name is required.'
    }

    if (!form.contact_person.trim()) {
      errs.contact_person = 'Authorized contact officer name is required.'
    }

    if (!form.email.trim()) {
      errs.email = 'Official communication email is required.'
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email.trim())) {
      errs.email = 'Please provide a valid official email address.'
    }

    if (!form.phone.trim()) {
      errs.phone = 'Contact phone number is required.'
    } else {
      // Validate 10-digit Indian phone or with +91 prefix
      const cleanPhone = form.phone.replace(/[\s-]/g, '')
      if (!/^(?:\+91|91)?[6-9]\d{9}$/.test(cleanPhone)) {
        errs.phone = 'Provide a valid 10-digit Indian mobile number.'
      }
    }

    if (form.pincode && !/^\d{6}$/.test(form.pincode.trim())) {
      errs.pincode = 'Indian postal PIN code must be exactly 6 digits.'
    }

    if (form.pan_number && !/^[A-Z]{5}[0-9]{4}[A-Z]{1}$/i.test(form.pan_number.trim())) {
      errs.pan_number = 'PAN format must be 5 letters, 4 numbers, 1 letter (e.g. AACCB1234N).'
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
        vendor_code: form.vendor_code.trim(),
        company_name: form.company_name.trim(),
        contact_person: form.contact_person.trim(),
        email: form.email.trim().toLowerCase(),
        phone: form.phone.trim(),
        gst_number: form.gst_number.trim().toUpperCase(),
        pan_number: form.pan_number.trim().toUpperCase(),
      }
      const res = await createVendor(payload)
      const created = res.data?.data ?? res.data
      navigate(created?.id ? `/app/vendors/${created.id}` : '/app/vendors')
    } catch (err) {
      const data = err.response?.data
      if (data?.errors) {
        setFieldErrors(data.errors)
      } else if (data?.message) {
        setError(data.message)
      } else {
        setError('Failed to onboard supplier. Please check form parameters.')
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
            <h4 className="fw-bold mb-0" style={{ color: '#102A43' }}>Register Defence Supplier / Vendor</h4>
            <span className="badge bg-secondary" style={{ fontSize: '0.7rem' }}>NEW ONBOARDING</span>
          </div>
          <p className="text-muted small mb-0">
            Onboard domestic and allied defence industrial partners in accordance with DAP 2020 Make-in-India guidelines.
          </p>
        </div>
        <Link to="/app/vendors" className="btn btn-outline-secondary btn-sm">
          <i className="bi bi-arrow-left me-1"></i>Back to Directory
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
        {/* Core Identity */}
        <div className="card border-0 shadow-sm p-4 rounded-3 bg-white mb-4">
          <h6 className="fw-bold pb-2 mb-3 border-bottom text-uppercase small" style={{ color: '#102A43', letterSpacing: '0.5px' }}>
            <i className="bi bi-building-check text-warning me-2"></i>1. Corporate &amp; Domain Identity
          </h6>

          <div className="row g-3">
            {/* Vendor Code */}
            <div className="col-md-6">
              <label className="form-label fw-semibold small" style={{ color: '#334E68' }}>
                Vendor Code <span className="text-danger">*</span>
              </label>
              <div className="input-group">
                <input
                  type="text"
                  name="vendor_code"
                  className={`form-control font-monospace ${fieldErrors.vendor_code ? 'is-invalid' : ''}`}
                  placeholder="e.g. VND-0001"
                  value={form.vendor_code}
                  onChange={handleChange}
                  required
                />
                <button
                  type="button"
                  className="btn btn-outline-secondary btn-sm"
                  onClick={handleAutoGenerateCode}
                  title="Generate Code"
                >
                  <i className="bi bi-magic me-1"></i>Auto
                </button>
                {fieldErrors.vendor_code && (
                  <div className="invalid-feedback d-block">{fieldErrors.vendor_code}</div>
                )}
              </div>
            </div>

            {/* Category */}
            <div className="col-md-6">
              <label className="form-label fw-semibold small" style={{ color: '#334E68' }}>
                Defence Industrial Category <span className="text-danger">*</span>
              </label>
              <select
                name="category"
                className="form-select"
                value={form.category}
                onChange={handleChange}
                required
              >
                <option value="Electronics">Electronics &bull; Avionics, Radars, SDR Radios</option>
                <option value="Mechanical">Mechanical &bull; Armoured Vehicles, Hull Fabrication</option>
                <option value="IT Services">IT Services &bull; C4I, Cyber Defence, Tactical GIS</option>
                <option value="Logistics">Logistics &bull; Heavy Transport, Field Supply</option>
                <option value="Chemicals">Chemicals &bull; Propellants, Pyrotechnics</option>
                <option value="Construction">Construction &bull; Hardened Shelters, Runways</option>
                <option value="Consulting">Consulting &bull; Audits, Ballistics R&amp;D</option>
                <option value="Ammunition">Ammunition &bull; Artillery Shells, Munitions</option>
                <option value="Vehicles">Vehicles &bull; Tactical MPVs, Amphibious</option>
                <option value="Other">Other Specialized Defence Solutions</option>
              </select>
            </div>

            {/* Company Name */}
            <div className="col-md-8">
              <label className="form-label fw-semibold small" style={{ color: '#334E68' }}>
                Registered Enterprise / Company Name <span className="text-danger">*</span>
              </label>
              <input
                type="text"
                name="company_name"
                className={`form-control ${fieldErrors.company_name ? 'is-invalid' : ''}`}
                placeholder="e.g., Bharat Electronics Limited or Tata Advanced Systems"
                value={form.company_name}
                onChange={handleChange}
                required
              />
              {fieldErrors.company_name && <div className="invalid-feedback">{fieldErrors.company_name}</div>}
            </div>

            {/* Status */}
            <div className="col-md-4">
              <label className="form-label fw-semibold small" style={{ color: '#334E68' }}>
                Supplier Status
              </label>
              <select
                name="status"
                className="form-select"
                value={form.status}
                onChange={handleChange}
              >
                <option value="Active">Active (Approved for Bidding)</option>
                <option value="Pending">Pending (Under Security Clearance)</option>
                <option value="Inactive">Inactive</option>
                <option value="Blacklisted">Blacklisted</option>
              </select>
            </div>
          </div>
        </div>

        {/* Contact & Location */}
        <div className="card border-0 shadow-sm p-4 rounded-3 bg-white mb-4">
          <h6 className="fw-bold pb-2 mb-3 border-bottom text-uppercase small" style={{ color: '#102A43', letterSpacing: '0.5px' }}>
            <i className="bi bi-geo-alt-fill text-warning me-2"></i>2. Official Communications &amp; Works Location
          </h6>

          <div className="row g-3">
            <div className="col-md-4">
              <label className="form-label fw-semibold small" style={{ color: '#334E68' }}>
                Authorized Contact Officer <span className="text-danger">*</span>
              </label>
              <input
                type="text"
                name="contact_person"
                className={`form-control ${fieldErrors.contact_person ? 'is-invalid' : ''}`}
                placeholder="Full name of representative"
                value={form.contact_person}
                onChange={handleChange}
                required
              />
              {fieldErrors.contact_person && <div className="invalid-feedback">{fieldErrors.contact_person}</div>}
            </div>

            <div className="col-md-4">
              <label className="form-label fw-semibold small" style={{ color: '#334E68' }}>
                Official Email Address <span className="text-danger">*</span>
              </label>
              <input
                type="email"
                name="email"
                className={`form-control ${fieldErrors.email ? 'is-invalid' : ''}`}
                placeholder="procurement@company.com"
                value={form.email}
                onChange={handleChange}
                required
              />
              {fieldErrors.email && <div className="invalid-feedback">{fieldErrors.email}</div>}
            </div>

            <div className="col-md-4">
              <label className="form-label fw-semibold small" style={{ color: '#334E68' }}>
                Contact Phone <span className="text-danger">*</span>
              </label>
              <input
                type="text"
                name="phone"
                className={`form-control ${fieldErrors.phone ? 'is-invalid' : ''}`}
                placeholder="+91 9876543210"
                value={form.phone}
                onChange={handleChange}
                required
              />
              {fieldErrors.phone && <div className="invalid-feedback">{fieldErrors.phone}</div>}
            </div>

            <div className="col-12">
              <label className="form-label fw-semibold small" style={{ color: '#334E68' }}>
                Factory / Corporate Address
              </label>
              <textarea
                name="address"
                rows="2"
                className="form-control"
                placeholder="Street address, Industrial Estate / Defence corridor details"
                value={form.address}
                onChange={handleChange}
              ></textarea>
            </div>

            <div className="col-md-4">
              <label className="form-label fw-semibold small" style={{ color: '#334E68' }}>City</label>
              <input
                type="text"
                name="city"
                className="form-control"
                placeholder="e.g. Bengaluru"
                value={form.city}
                onChange={handleChange}
              />
            </div>

            <div className="col-md-4">
              <label className="form-label fw-semibold small" style={{ color: '#334E68' }}>State</label>
              <input
                type="text"
                name="state"
                className="form-control"
                placeholder="e.g. Karnataka"
                value={form.state}
                onChange={handleChange}
              />
            </div>

            <div className="col-md-4">
              <label className="form-label fw-semibold small" style={{ color: '#334E68' }}>PIN Code</label>
              <input
                type="text"
                name="pincode"
                className={`form-control font-monospace ${fieldErrors.pincode ? 'is-invalid' : ''}`}
                placeholder="6-digit PIN"
                value={form.pincode}
                onChange={handleChange}
                maxLength="6"
              />
              {fieldErrors.pincode && <div className="invalid-feedback">{fieldErrors.pincode}</div>}
            </div>
          </div>
        </div>

        {/* Taxation & Statutory Compliance */}
        <div className="card border-0 shadow-sm p-4 rounded-3 bg-white mb-4">
          <h6 className="fw-bold pb-2 mb-3 border-bottom text-uppercase small" style={{ color: '#102A43', letterSpacing: '0.5px' }}>
            <i className="bi bi-shield-lock-fill text-warning me-2"></i>3. Statutory Taxation &amp; Defence Procurement Compliance
          </h6>

          <div className="row g-3">
            <div className="col-md-6">
              <label className="form-label fw-semibold small" style={{ color: '#334E68' }}>
                GSTIN Number (15 Characters)
              </label>
              <input
                type="text"
                name="gst_number"
                className="form-control font-monospace text-uppercase"
                placeholder="e.g. 29AACCB1234N1Z5"
                value={form.gst_number}
                onChange={handleChange}
                maxLength="15"
              />
              <small className="text-muted" style={{ fontSize: '0.72rem' }}>
                Required for 18% GST calculation in the Finance Module
              </small>
            </div>

            <div className="col-md-6">
              <label className="form-label fw-semibold small" style={{ color: '#334E68' }}>
                Income Tax PAN (10 Characters)
              </label>
              <input
                type="text"
                name="pan_number"
                className={`form-control font-monospace text-uppercase ${fieldErrors.pan_number ? 'is-invalid' : ''}`}
                placeholder="e.g. AACCB1234N"
                value={form.pan_number}
                onChange={handleChange}
                maxLength="10"
              />
              {fieldErrors.pan_number && <div className="invalid-feedback">{fieldErrors.pan_number}</div>}
            </div>
          </div>
        </div>

        {/* Action Controls */}
        <div className="d-flex justify-content-end gap-3 mb-5">
          <Link to="/app/vendors" className="btn btn-outline-secondary px-4">
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
                <span>Registering Supplier...</span>
              </>
            ) : (
              <>
                <i className="bi bi-check-circle-fill text-warning"></i>
                <span>Register Defence Vendor</span>
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  )
}
