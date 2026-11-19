import { useState, useEffect } from 'react'
import { Link, useNavigate, useSearchParams } from 'react-router-dom'
import { getInvoices, getInvoice, createPayment } from '../../api/financeApi.js'
import { formatINR } from '../../utils/formatters.js'

export default function PaymentCreatePage() {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const initialInvoiceId = searchParams.get('invoice') || ''

  const [invoices, setInvoices] = useState([])
  const [selectedInvoice, setSelectedInvoice] = useState(null)
  const [loadingInvoices, setLoadingInvoices] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')

  // Form State
  const [formData, setFormData] = useState(() => ({
    invoice: initialInvoiceId,
    payment_reference: `RTGS-${new Date().getFullYear()}-${Math.floor(100000 + Math.random() * 900000)}`,
    payment_date: new Date().toISOString().split('T')[0],
    amount: '',
    payment_method: 'RTGS',
    status: 'Completed',
    remarks: '',
  }))

  // Auto-generate reference number
  const handleAutoReference = () => {
    const year = new Date().getFullYear()
    const method = formData.payment_method || 'RTGS'
    const rand = Math.floor(100000 + Math.random() * 900000)
    setFormData(prev => ({ ...prev, payment_reference: `${method}-${year}-${rand}` }))
  }

  // Load Invoices list
  useEffect(() => {
    getInvoices({ page_size: 100 })
      .then(res => {
        const list = res.data?.data?.results || res.data?.results || res.data?.data || []
        setInvoices(list)

        // If initialInvoiceId exists, select it
        if (initialInvoiceId) {
          const match = list.find(inv => String(inv.id) === String(initialInvoiceId))
          if (match) {
            setSelectedInvoice(match)
            const bal = parseFloat(match.balance_amount)
            setFormData(prev => ({
              ...prev,
              amount: bal !== undefined && bal > 0 ? bal : (parseFloat(match.total_amount) || 0),
            }))
          } else {
            // Fetch individually if not in top list
            getInvoice(initialInvoiceId).then(invRes => {
              const data = invRes.data?.data ?? invRes.data
              setSelectedInvoice(data)
              const bal = parseFloat(data.balance_amount)
              setFormData(prev => ({
                ...prev,
                amount: bal !== undefined && bal > 0 ? bal : (parseFloat(data.total_amount) || 0),
              }))
            }).catch(() => {})
          }
        }
      })
      .catch((err) => {
        setError(err.response?.data?.message || 'Failed to load invoices list.')
      })
      .finally(() => {
        setLoadingInvoices(false)
      })
  }, [initialInvoiceId])

  // When invoice selection changes
  const handleInvoiceChange = (e) => {
    const invId = e.target.value
    const found = invoices.find(i => String(i.id) === String(invId))
    setSelectedInvoice(found || null)

    const bal = found ? parseFloat(found.balance_amount) : 0
    setFormData(prev => ({
      ...prev,
      invoice: invId,
      amount: bal > 0 ? bal : (found ? parseFloat(found.total_amount) : ''),
    }))
  }

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')

    if (!formData.invoice) {
      setError('Please select an invoice for settlement.')
      return
    }
    if (!formData.payment_reference.trim()) {
      setError('Payment reference number / UTR is required.')
      return
    }
    const amt = parseFloat(formData.amount)
    if (isNaN(amt) || amt <= 0) {
      setError('Payment disbursement amount must be greater than zero.')
      return
    }
    if (!formData.payment_date) {
      setError('Payment settlement date is required.')
      return
    }

    setSubmitting(true)
    try {
      const payload = {
        invoice: parseInt(formData.invoice, 10),
        payment_reference: formData.payment_reference.trim(),
        payment_date: formData.payment_date,
        amount: amt,
        payment_method: formData.payment_method,
        status: formData.status,
        remarks: formData.remarks.trim(),
      }

      await createPayment(payload)
      navigate(`/app/finance/invoices/${formData.invoice}`)
    } catch (err) {
      const respData = err.response?.data
      let message = 'Failed to record payment disbursement.'
      if (typeof respData === 'object' && respData !== null) {
        if (respData.message) {
          message = respData.message
        } else if (respData.errors) {
          message = Object.entries(respData.errors)
            .map(([k, v]) => `${k}: ${Array.isArray(v) ? v.join(', ') : v}`)
            .join(' | ')
        } else {
          message = Object.entries(respData)
            .map(([k, v]) => `${k}: ${Array.isArray(v) ? v.join(', ') : v}`)
            .join(' | ')
        }
      }
      setError(message)
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="container-fluid p-0">
      {/* Header */}
      <div className="d-flex flex-column flex-sm-row justify-content-between align-items-sm-center gap-3 mb-4 pb-2 border-bottom">
        <div>
          <div className="d-flex align-items-center gap-2 mb-1">
            <h4 className="fw-bold mb-0" style={{ color: '#102A43' }}>Record Payment Disbursement</h4>
            <span className="badge bg-secondary" style={{ fontSize: '0.7rem' }}>MODULE 4B</span>
          </div>
          <p className="text-muted small mb-0">
            Execute banking settlement voucher against approved defence invoice milestone deliverables.
          </p>
        </div>

        <div className="d-flex gap-2">
          {formData.invoice && (
            <Link
              to={`/app/finance/invoices/${formData.invoice}`}
              className="btn btn-outline-secondary btn-sm d-flex align-items-center gap-1"
            >
              <i className="bi bi-arrow-left"></i>
              <span>Back to Invoice</span>
            </Link>
          )}
          <Link to="/app/finance/payments" className="btn btn-outline-secondary btn-sm d-flex align-items-center gap-1">
            <i className="bi bi-cash-stack"></i>
            <span>All Disbursements</span>
          </Link>
        </div>
      </div>

      {/* Error alert */}
      {error && (
        <div className="alert alert-danger d-flex align-items-center gap-2 small mb-4" role="alert">
          <i className="bi bi-exclamation-triangle-fill text-danger flex-shrink-0"></i>
          <span className="flex-grow-1">{error}</span>
          <button type="button" className="btn-close" onClick={() => setError('')}></button>
        </div>
      )}

      <form onSubmit={handleSubmit}>
        <div className="row g-4">
          <div className="col-lg-8">
            <div className="card border-0 shadow-sm p-4 rounded-3 bg-white mb-4">
              <h6 className="fw-bold mb-3 text-uppercase text-secondary" style={{ fontSize: '0.8rem', letterSpacing: '0.5px' }}>
                <i className="bi bi-wallet2 me-2 text-primary"></i>
                Banking &amp; Disbursement Particulars
              </h6>

              <div className="row g-3">
                {/* Select Invoice */}
                <div className="col-12">
                  <label htmlFor="invoice" className="form-label small fw-semibold">
                    Target Defence Invoice <span className="text-danger">*</span>
                  </label>
                  <select
                    id="invoice"
                    name="invoice"
                    className="form-select form-select-sm"
                    value={formData.invoice}
                    onChange={handleInvoiceChange}
                    disabled={loadingInvoices}
                    required
                  >
                    <option value="">-- Select Target Invoice --</option>
                    {invoices.map(inv => (
                      <option key={inv.id} value={inv.id}>
                        {inv.invoice_number} — {inv.vendor_name || 'Vendor'} — Total: {formatINR(inv.total_amount)} (Balance: {formatINR(inv.balance_amount)})
                      </option>
                    ))}
                  </select>
                </div>

                {/* Payment Reference */}
                <div className="col-md-6">
                  <label htmlFor="payment_reference" className="form-label small fw-semibold">
                    Payment Reference / UTR # <span className="text-danger">*</span>
                  </label>
                  <div className="input-group input-group-sm">
                    <input
                      type="text"
                      id="payment_reference"
                      name="payment_reference"
                      className="form-control"
                      placeholder="e.g. RTGS-2026-948201"
                      value={formData.payment_reference}
                      onChange={handleChange}
                      required
                    />
                    <button
                      type="button"
                      className="btn btn-outline-secondary"
                      onClick={handleAutoReference}
                      title="Auto generate reference"
                    >
                      <i className="bi bi-magic me-1"></i> Auto
                    </button>
                  </div>
                </div>

                {/* Payment Date */}
                <div className="col-md-6">
                  <label htmlFor="payment_date" className="form-label small fw-semibold">
                    Settlement Date <span className="text-danger">*</span>
                  </label>
                  <input
                    type="date"
                    id="payment_date"
                    name="payment_date"
                    className="form-control form-control-sm"
                    value={formData.payment_date}
                    onChange={handleChange}
                    required
                  />
                </div>

                {/* Amount */}
                <div className="col-md-6">
                  <label htmlFor="amount" className="form-label small fw-semibold">
                    Disbursed Amount (₹) <span className="text-danger">*</span>
                  </label>
                  <div className="input-group input-group-sm">
                    <span className="input-group-text">₹</span>
                    <input
                      type="number"
                      step="0.01"
                      id="amount"
                      name="amount"
                      className="form-control"
                      placeholder="0.00"
                      value={formData.amount}
                      onChange={handleChange}
                      required
                    />
                  </div>
                </div>

                {/* Payment Method */}
                <div className="col-md-3">
                  <label htmlFor="payment_method" className="form-label small fw-semibold">
                    Transfer Method <span className="text-danger">*</span>
                  </label>
                  <select
                    id="payment_method"
                    name="payment_method"
                    className="form-select form-select-sm"
                    value={formData.payment_method}
                    onChange={handleChange}
                    required
                  >
                    <option value="RTGS">RTGS (High Value)</option>
                    <option value="NEFT">NEFT (Standard)</option>
                    <option value="IMPS">IMPS (Immediate)</option>
                    <option value="Cheque">Cheque</option>
                    <option value="DD">Demand Draft</option>
                  </select>
                </div>

                {/* Status */}
                <div className="col-md-3">
                  <label htmlFor="status" className="form-label small fw-semibold">
                    Clearance Status <span className="text-danger">*</span>
                  </label>
                  <select
                    id="status"
                    name="status"
                    className="form-select form-select-sm"
                    value={formData.status}
                    onChange={handleChange}
                    required
                  >
                    <option value="Completed">Completed</option>
                    <option value="Processing">Processing</option>
                    <option value="Initiated">Initiated</option>
                  </select>
                </div>

                {/* Remarks */}
                <div className="col-12">
                  <label htmlFor="remarks" className="form-label small fw-semibold">
                    Treasury Remarks / Bank Transaction ID
                  </label>
                  <textarea
                    id="remarks"
                    name="remarks"
                    rows="3"
                    className="form-control form-control-sm"
                    placeholder="Enter RBI Transaction Reference ID, clearing branch, or verification remarks..."
                    value={formData.remarks}
                    onChange={handleChange}
                  ></textarea>
                </div>
              </div>
            </div>
          </div>

          {/* Right Summary Column */}
          <div className="col-lg-4">
            <div className="card border-0 shadow-sm p-4 rounded-3 bg-white mb-4">
              <h6 className="fw-bold mb-3 text-uppercase text-secondary" style={{ fontSize: '0.8rem', letterSpacing: '0.5px' }}>
                <i className="bi bi-file-earmark-check me-2 text-success"></i>
                Invoice Balance Check
              </h6>

              {selectedInvoice ? (
                <div className="border rounded-2 p-3 bg-light mb-4">
                  <div className="fw-bold text-dark mb-1">{selectedInvoice.invoice_number}</div>
                  <div className="small text-muted mb-3">{selectedInvoice.vendor_name || 'Defence Supplier'}</div>

                  <div className="d-flex justify-content-between align-items-center mb-1 small">
                    <span className="text-muted">Total Claimed:</span>
                    <span className="fw-semibold text-dark">{formatINR(selectedInvoice.total_amount)}</span>
                  </div>
                  <div className="d-flex justify-content-between align-items-center mb-1 small">
                    <span className="text-muted">Already Disbursed:</span>
                    <span className="fw-semibold text-success">{formatINR(selectedInvoice.paid_amount)}</span>
                  </div>
                  <hr className="my-2" />
                  <div className="d-flex justify-content-between align-items-center">
                    <span className="fw-bold text-dark">Outstanding Balance:</span>
                    <span className="fw-bold text-danger">{formatINR(selectedInvoice.balance_amount)}</span>
                  </div>
                </div>
              ) : (
                <div className="alert alert-secondary py-3 text-center small mb-4">
                  Select an invoice on the left to verify current disbursement status and outstanding dues.
                </div>
              )}

              <div className="d-grid gap-2">
                <button
                  type="submit"
                  className="btn btn-navy py-2 fw-semibold d-flex align-items-center justify-content-center gap-2 shadow-sm"
                  disabled={submitting}
                >
                  {submitting ? (
                    <>
                      <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
                      <span>Recording Transfer...</span>
                    </>
                  ) : (
                    <>
                      <i className="bi bi-check2-circle"></i>
                      <span>Record Bank Transfer</span>
                    </>
                  )}
                </button>

                <Link to="/app/finance/payments" className="btn btn-outline-secondary py-2 small">
                  Cancel
                </Link>
              </div>
            </div>
          </div>
        </div>
      </form>
    </div>
  )
}
