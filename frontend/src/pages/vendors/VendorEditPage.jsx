import { useState, useEffect } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import { getVendor, updateVendor } from '../../api/vendorApi.js'
import LoadingSpinner from '../../components/common/LoadingSpinner.jsx'

export default function VendorEditPage() {
  const { id } = useParams()
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

  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')
  const [fieldErrors, setFieldErrors] = useState({})

  useEffect(() => {
    let isMounted = true
    getVendor(id)
      .then((res) => {
        if (!isMounted) return
        const v = res.data?.data ?? res.data
        setForm({
          vendor_code: v.vendor_code || '',
          company_name: v.company_name || '',
          category: v.category || 'Electronics',
          contact_person: v.contact_person || '',
          email: v.email || '',
          phone: v.phone || '',
          address: v.address || '',
          city: v.city || '',
          state: v.state || '',
          pincode: v.pincode || '',
          gst_number: v.gst_number || '',
          pan_number: v.pan_number || '',
          status: v.status || 'Active',
        })
      })
      .catch((err) => {
        if (!isMounted) return
        setError(err.response?.data?.message || 'Failed to retrieve vendor profile for editing.')
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

    if (!form.vendor_code.trim()) {
      errs.vendor_code = 'Vendor code is required.'
    }

    if (!form.company_name.trim()) {
      errs.company_name = 'Enterprise name is required.'
    }

    if (!form.contact_person.trim()) {
      errs.contact_person = 'Contact officer name is required.'
    }

    if (!form.email.trim()) {
      errs.email = 'Official email is required.'
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email.trim())) {
      errs.email = 'Please provide a valid official email address.'
    }

    if (!form.phone.trim()) {
      errs.phone = 'Phone number is required.'
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
      await updateVendor(id, payload)
      navigate(`/app/vendors/${id}`)
    } catch (err) {
      const data = err.response?.data
      if (data?.errors) {
        setFieldErrors(data.errors)
      } else if (data?.message) {
        setError(data.message)
      } else {
        setError('Failed to update vendor profile. Please verify input parameters.')
      }
    } finally {
      setSubmitting(false)
    }
  }

  if (loading) {
    return (
      <div className="p-5 text-center">
        <LoadingSpinner message="Retrieving Supplier Record for Revision..." />
      </div>
    )
  }

  return (
    <div className="container-fluid p-0" style={{ maxWidth: '960px' }}>
      {/* Header */}
      <div className="d-flex align-items-center justify-content-between mb-4 pb-2 border-bottom">
        <div>
          <div className="d-flex align-items-center gap-2 mb-1">
            <h4 className="fw-bold mb-0" style={{ color: '#102A43' }}>Amend Supplier Dossier</h4>
            <span className="badge bg-primary" style={{ fontSize: '0.7rem' }}>EDITING #{id}</span>
          </div>
          <p className="text-muted small mb-0">
            Revise corporate credentials, category, or statutory details for {form.company_name}.
          </p>
        </div>
        <Link to={`/app/vendors/${id}`} className="btn btn-outline-secondary btn-sm">
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
        {/* Core Identity */}
        <div className="card border-0 shadow-sm p-4 rounded-3 bg-white mb-4">
          <h6 className="fw-bold pb-2 mb-3 border-bottom text-uppercase small" style={{ color: '#102A43', letterSpacing: '0.5px' }}>
            <i className="bi bi-building-check text-warning me-2"></i>1. Corporate &amp; Domain Identity
          </h6>

          <div className="row g-3">
            <div className="col-md-6">
              <label className="form-label fw-semibold small" style={{ color: '#334E68' }}>
                Vendor Code <span className="text-danger">*</span>
              </label>
              <input
                type="text"
                name="vendor_code"
                className={`form-control font-monospace ${fieldErrors.vendor_code ? 'is-invalid' : ''}`}
                value={form.vendor_code}
                onChange={handleChange}
                required
              />
              {fieldErrors.vendor_code && <div className="invalid-feedback">{fieldErrors.vendor_code}</div>}
            </div>

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

            <div className="col-md-8">
              <label className="form-label fw-semibold small" style={{ color: '#334E68' }}>
                Enterprise / Company Name <span className="text-danger">*</span>
              </label>
              <input
                type="text"
                name="company_name"
                className={`form-control ${fieldErrors.company_name ? 'is-invalid' : ''}`}
                value={form.company_name}
                onChange={handleChange}
                required
              />
              {fieldErrors.company_name && <div className="invalid-feedback">{fieldErrors.company_name}</div>}
            </div>

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
                <option value="Active">Active</option>
                <option value="Pending">Pending</option>
                <option value="Inactive">Inactive</option>
                <option value="Blacklisted">Blacklisted</option>
              </select>
            </div>
          </div>
        </div>

        {/* Contact & Location */}
        <div className="card border-0 shadow-sm p-4 rounded-3 bg-white mb-4">
          <h6 className="fw-bold pb-2 mb-3 border-bottom text-uppercase small" style={{ color: '#102A43', letterSpacing: '0.5px' }}>
            <i className="bi bi-geo-alt-fill text-warning me-2"></i>2. Communications &amp; Location
          </h6>

          <div className="row g-3">
            <div className="col-md-4">
              <label className="form-label fw-semibold small" style={{ color: '#334E68' }}>
                Contact Person <span className="text-danger">*</span>
              </label>
              <input
                type="text"
                name="contact_person"
                className={`form-control ${fieldErrors.contact_person ? 'is-invalid' : ''}`}
                value={form.contact_person}
                onChange={handleChange}
                required
              />
              {fieldErrors.contact_person && <div className="invalid-feedback">{fieldErrors.contact_person}</div>}
            </div>

            <div className="col-md-4">
              <label className="form-label fw-semibold small" style={{ color: '#334E68' }}>
                Official Email <span className="text-danger">*</span>
              </label>
              <input
                type="email"
                name="email"
                className={`form-control ${fieldErrors.email ? 'is-invalid' : ''}`}
                value={form.email}
                onChange={handleChange}
                required
              />
              {fieldErrors.email && <div className="invalid-feedback">{fieldErrors.email}</div>}
            </div>

            <div className="col-md-4">
              <label className="form-label fw-semibold small" style={{ color: '#334E68' }}>
                Phone <span className="text-danger">*</span>
              </label>
              <input
                type="text"
                name="phone"
                className={`form-control ${fieldErrors.phone ? 'is-invalid' : ''}`}
                value={form.phone}
                onChange={handleChange}
                required
              />
              {fieldErrors.phone && <div className="invalid-feedback">{fieldErrors.phone}</div>}
            </div>

            <div className="col-12">
              <label className="form-label fw-semibold small" style={{ color: '#334E68' }}>
                Corporate Address
              </label>
              <textarea
                name="address"
                rows="2"
                className="form-control"
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
                value={form.pincode}
                onChange={handleChange}
                maxLength="6"
              />
              {fieldErrors.pincode && <div className="invalid-feedback">{fieldErrors.pincode}</div>}
            </div>
          </div>
        </div>

        {/* Taxation */}
        <div className="card border-0 shadow-sm p-4 rounded-3 bg-white mb-4">
          <h6 className="fw-bold pb-2 mb-3 border-bottom text-uppercase small" style={{ color: '#102A43', letterSpacing: '0.5px' }}>
            <i className="bi bi-shield-lock-fill text-warning me-2"></i>3. Taxation Credentials
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
                value={form.gst_number}
                onChange={handleChange}
                maxLength="15"
              />
            </div>

            <div className="col-md-6">
              <label className="form-label fw-semibold small" style={{ color: '#334E68' }}>
                Income Tax PAN (10 Characters)
              </label>
              <input
                type="text"
                name="pan_number"
                className={`form-control font-monospace text-uppercase ${fieldErrors.pan_number ? 'is-invalid' : ''}`}
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
                <span>Updating Supplier...</span>
              </>
            ) : (
              <>
                <i className="bi bi-check-circle-fill text-warning"></i>
                <span>Update Supplier Record</span>
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  )
}
