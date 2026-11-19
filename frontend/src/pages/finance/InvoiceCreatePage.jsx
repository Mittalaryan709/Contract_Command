import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { createInvoice, createInvoiceItem } from '../../api/financeApi.js'
import { getContracts } from '../../api/contractApi.js'
import { getVendors } from '../../api/vendorApi.js'
import { formatINR } from '../../utils/formatters.js'

export default function InvoiceCreatePage() {
  const navigate = useNavigate()

  const [contracts, setContracts] = useState([])
  const [vendors, setVendors] = useState([])
  const [loadingData, setLoadingData] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')

  // Form State
  const [formData, setFormData] = useState(() => ({
    invoice_number: `INV-${new Date().getFullYear()}-${Math.floor(10000 + Math.random() * 90000)}`,
    contract: '',
    vendor: '',
    invoice_date: new Date().toISOString().split('T')[0],
    due_date: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    status: 'Submitted',
    tax_percent: 18.00,
    notes: '',
  }))

  // Line items state
  const [items, setItems] = useState([
    { description: 'Defence Equipment Deliverables Milestone 1', quantity: 1, unit_price: 500000 },
  ])

  // Fetch contracts and vendors
  useEffect(() => {
    Promise.all([
      getContracts({ page_size: 100 }),
      getVendors({ page_size: 100 }),
    ])
      .then(([contractsRes, vendorsRes]) => {
        const cList = contractsRes.data?.data?.results || contractsRes.data?.results || contractsRes.data?.data || []
        const vList = vendorsRes.data?.data?.results || vendorsRes.data?.results || vendorsRes.data?.data || []
        setContracts(cList)
        setVendors(vList)
      })
      .catch((err) => {
        setError(err.response?.data?.message || 'Failed to load master contracts and vendors.')
      })
      .finally(() => {
        setLoadingData(false)
      })
  }, [])

  // Auto-generate invoice number
  const handleAutoNumber = () => {
    const year = new Date().getFullYear()
    const rand = Math.floor(10000 + Math.random() * 90000)
    setFormData(prev => ({ ...prev, invoice_number: `INV-${year}-${rand}` }))
  }

  // Handle Contract selection: auto-fill vendor if linked
  const handleContractChange = (e) => {
    const selectedContractId = e.target.value
    const foundContract = contracts.find(c => String(c.id) === String(selectedContractId))
    setFormData(prev => ({
      ...prev,
      contract: selectedContractId,
      vendor: foundContract?.vendor ? String(foundContract.vendor) : prev.vendor,
    }))
  }

  // Handle standard field changes
  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  // Line item handlers
  const handleItemChange = (index, field, value) => {
    setItems(prev => {
      const updated = [...prev]
      updated[index] = { ...updated[index], [field]: value }
      return updated
    })
  }

  const handleAddItem = () => {
    setItems(prev => [...prev, { description: '', quantity: 1, unit_price: 0 }])
  }

  const handleRemoveItem = (index) => {
    if (items.length <= 1) return
    setItems(prev => prev.filter((_, i) => i !== index))
  }

  // Dynamic calculations
  const subtotal = items.reduce((sum, item) => {
    const q = parseFloat(item.quantity) || 0
    const p = parseFloat(item.unit_price) || 0
    return sum + (q * p)
  }, 0)

  const taxPercent = parseFloat(formData.tax_percent) || 0
  const taxAmount = Math.round((subtotal * taxPercent / 100) * 100) / 100
  const totalAmount = subtotal + taxAmount

  // Form submission
  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')

    // Validation
    if (!formData.invoice_number.trim()) {
      setError('Invoice number is required.')
      return
    }
    const invPattern = /^INV-\d{4}-\d{5}$/
    if (!invPattern.test(formData.invoice_number.trim())) {
      setError('Invoice number must follow format INV-YYYY-NNNNN (e.g. INV-2026-00001).')
      return
    }
    if (!formData.contract) {
      setError('Please select an active defence contract.')
      return
    }
    if (!formData.vendor) {
      setError('Please select the prime defence supplier/vendor.')
      return
    }
    if (!formData.invoice_date || !formData.due_date) {
      setError('Both invoice date and due date are mandatory.')
      return
    }
    if (formData.due_date < formData.invoice_date) {
      setError('Due date cannot precede the invoice submission date.')
      return
    }
    if (items.length === 0) {
      setError('At least one billable line item is required.')
      return
    }
    for (let i = 0; i < items.length; i++) {
      const itm = items[i]
      if (!itm.description.trim()) {
        setError(`Line item #${i + 1} requires a valid description.`)
        return
      }
      if ((parseFloat(itm.quantity) || 0) <= 0) {
        setError(`Line item #${i + 1} quantity must be greater than zero.`)
        return
      }
      if ((parseFloat(itm.unit_price) || 0) <= 0) {
        setError(`Line item #${i + 1} unit price must be greater than zero.`)
        return
      }
    }

    setSubmitting(true)
    try {
      // 1. Create Invoice
      const invoicePayload = {
        invoice_number: formData.invoice_number.trim(),
        contract: parseInt(formData.contract, 10),
        vendor: parseInt(formData.vendor, 10),
        invoice_date: formData.invoice_date,
        due_date: formData.due_date,
        status: formData.status,
        tax_percent: parseFloat(formData.tax_percent) || 18.00,
        notes: formData.notes.trim(),
      }

      const invRes = await createInvoice(invoicePayload)
      const invoiceData = invRes.data?.data ?? invRes.data
      const newInvoiceId = invoiceData.id

      // 2. Create Line Items
      for (const itm of items) {
        await createInvoiceItem({
          invoice: newInvoiceId,
          description: itm.description.trim(),
          quantity: parseFloat(itm.quantity),
          unit_price: parseFloat(itm.unit_price),
        })
      }

      navigate(`/app/finance/invoices/${newInvoiceId}`)
    } catch (err) {
      const respData = err.response?.data
      let message = 'Failed to generate invoice.'
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
            <h4 className="fw-bold mb-0" style={{ color: '#102A43' }}>Create Defence Invoice</h4>
            <span className="badge bg-secondary" style={{ fontSize: '0.7rem' }}>MODULE 4A</span>
          </div>
          <p className="text-muted small mb-0">
            Submit contractor milestone billing with itemized procurement deliverables and statutory 18% GST.
          </p>
        </div>

        <Link to="/app/finance/invoices" className="btn btn-outline-secondary btn-sm d-flex align-items-center gap-1">
          <i className="bi bi-arrow-left"></i>
          <span>Back to Invoices</span>
        </Link>
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
          {/* Main Invoice Form Column */}
          <div className="col-lg-8">
            {/* Primary Details Card */}
            <div className="card border-0 shadow-sm p-4 rounded-3 bg-white mb-4">
              <h6 className="fw-bold mb-3 text-uppercase text-secondary" style={{ fontSize: '0.8rem', letterSpacing: '0.5px' }}>
                <i className="bi bi-file-earmark-medical me-2 text-primary"></i>
                Invoice Parameters
              </h6>

              <div className="row g-3">
                {/* Invoice Number */}
                <div className="col-md-6">
                  <label htmlFor="invoice_number" className="form-label small fw-semibold">
                    Invoice Number <span className="text-danger">*</span>
                  </label>
                  <div className="input-group input-group-sm">
                    <input
                      type="text"
                      id="invoice_number"
                      name="invoice_number"
                      className="form-control"
                      placeholder="INV-YYYY-NNNNN"
                      value={formData.invoice_number}
                      onChange={handleChange}
                      required
                    />
                    <button
                      type="button"
                      className="btn btn-outline-secondary"
                      onClick={handleAutoNumber}
                      title="Generate auto number"
                    >
                      <i className="bi bi-magic me-1"></i> Auto
                    </button>
                  </div>
                  <div className="form-text" style={{ fontSize: '0.75rem' }}>Pattern: INV-YYYY-NNNNN</div>
                </div>

                {/* Status */}
                <div className="col-md-6">
                  <label htmlFor="status" className="form-label small fw-semibold">
                    Initial Status <span className="text-danger">*</span>
                  </label>
                  <select
                    id="status"
                    name="status"
                    className="form-select form-select-sm"
                    value={formData.status}
                    onChange={handleChange}
                    required
                  >
                    <option value="Draft">Draft</option>
                    <option value="Submitted">Submitted (For Audit)</option>
                    <option value="Approved">Approved</option>
                  </select>
                </div>

                {/* Contract Selection */}
                <div className="col-md-6">
                  <label htmlFor="contract" className="form-label small fw-semibold">
                    Associated Defence Contract <span className="text-danger">*</span>
                  </label>
                  <select
                    id="contract"
                    name="contract"
                    className="form-select form-select-sm"
                    value={formData.contract}
                    onChange={handleContractChange}
                    disabled={loadingData}
                    required
                  >
                    <option value="">-- Select Defence Contract --</option>
                    {contracts.map(c => (
                      <option key={c.id} value={c.id}>
                        {c.contract_number} — {c.title}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Vendor Selection */}
                <div className="col-md-6">
                  <label htmlFor="vendor" className="form-label small fw-semibold">
                    Contractor / Defence Supplier <span className="text-danger">*</span>
                  </label>
                  <select
                    id="vendor"
                    name="vendor"
                    className="form-select form-select-sm"
                    value={formData.vendor}
                    onChange={handleChange}
                    disabled={loadingData}
                    required
                  >
                    <option value="">-- Select Supplier --</option>
                    {vendors.map(v => (
                      <option key={v.id} value={v.id}>
                        {v.company_name} ({v.vendor_code || `ID: ${v.id}`})
                      </option>
                    ))}
                  </select>
                </div>

                {/* Invoice Date */}
                <div className="col-md-4">
                  <label htmlFor="invoice_date" className="form-label small fw-semibold">
                    Invoice Date <span className="text-danger">*</span>
                  </label>
                  <input
                    type="date"
                    id="invoice_date"
                    name="invoice_date"
                    className="form-control form-control-sm"
                    value={formData.invoice_date}
                    onChange={handleChange}
                    required
                  />
                </div>

                {/* Due Date */}
                <div className="col-md-4">
                  <label htmlFor="due_date" className="form-label small fw-semibold">
                    Payment Due Date <span className="text-danger">*</span>
                  </label>
                  <input
                    type="date"
                    id="due_date"
                    name="due_date"
                    className="form-control form-control-sm"
                    value={formData.due_date}
                    onChange={handleChange}
                    required
                  />
                </div>

                {/* Statutory GST Rate */}
                <div className="col-md-4">
                  <label htmlFor="tax_percent" className="form-label small fw-semibold">
                    GST Rate (%) <span className="text-danger">*</span>
                  </label>
                  <div className="input-group input-group-sm">
                    <input
                      type="number"
                      step="0.01"
                      id="tax_percent"
                      name="tax_percent"
                      className="form-control"
                      value={formData.tax_percent}
                      onChange={handleChange}
                      required
                    />
                    <span className="input-group-text">%</span>
                  </div>
                </div>

                {/* Notes */}
                <div className="col-12">
                  <label htmlFor="notes" className="form-label small fw-semibold">
                    Audit Notes &amp; Delivery Reference
                  </label>
                  <textarea
                    id="notes"
                    name="notes"
                    rows="2"
                    className="form-control form-control-sm"
                    placeholder="Enter milestone deliverable reference, inspection certificate details, or billing remarks..."
                    value={formData.notes}
                    onChange={handleChange}
                  ></textarea>
                </div>
              </div>
            </div>

            {/* Line Items Card */}
            <div className="card border-0 shadow-sm p-4 rounded-3 bg-white">
              <div className="d-flex justify-content-between align-items-center mb-3">
                <h6 className="fw-bold mb-0 text-uppercase text-secondary" style={{ fontSize: '0.8rem', letterSpacing: '0.5px' }}>
                  <i className="bi bi-list-check me-2 text-primary"></i>
                  Billable Deliverables &amp; Line Items
                </h6>

                <button
                  type="button"
                  className="btn btn-outline-primary btn-sm d-flex align-items-center gap-1"
                  onClick={handleAddItem}
                >
                  <i className="bi bi-plus-circle"></i>
                  <span>Add Line Item</span>
                </button>
              </div>

              <div className="table-responsive">
                <table className="table table-bordered table-sm align-middle mb-0">
                  <thead className="table-light">
                    <tr>
                      <th style={{ width: '45%' }}>Description / Deliverable</th>
                      <th style={{ width: '15%' }} className="text-end">Qty</th>
                      <th style={{ width: '20%' }} className="text-end">Unit Price (₹)</th>
                      <th style={{ width: '15%' }} className="text-end">Line Total (₹)</th>
                      <th style={{ width: '5%' }} className="text-center">Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {items.map((item, index) => {
                      const lineTotal = (parseFloat(item.quantity) || 0) * (parseFloat(item.unit_price) || 0)
                      return (
                        <tr key={index}>
                          <td>
                            <input
                              type="text"
                              className="form-control form-control-sm"
                              placeholder="e.g. Radar subsystem integration package"
                              value={item.description}
                              onChange={(e) => handleItemChange(index, 'description', e.target.value)}
                              required
                            />
                          </td>
                          <td>
                            <input
                              type="number"
                              step="0.01"
                              className="form-control form-control-sm text-end"
                              value={item.quantity}
                              onChange={(e) => handleItemChange(index, 'quantity', e.target.value)}
                              required
                            />
                          </td>
                          <td>
                            <input
                              type="number"
                              step="0.01"
                              className="form-control form-control-sm text-end"
                              value={item.unit_price}
                              onChange={(e) => handleItemChange(index, 'unit_price', e.target.value)}
                              required
                            />
                          </td>
                          <td className="text-end fw-semibold">
                            {formatINR(lineTotal)}
                          </td>
                          <td className="text-center">
                            <button
                              type="button"
                              className="btn btn-sm btn-link text-danger p-0"
                              onClick={() => handleRemoveItem(index)}
                              disabled={items.length <= 1}
                              title={items.length <= 1 ? 'Minimum 1 item required' : 'Remove item'}
                            >
                              <i className="bi bi-trash"></i>
                            </button>
                          </td>
                        </tr>
                      )
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          {/* Right Summary Column */}
          <div className="col-lg-4">
            <div className="card border-0 shadow-sm p-4 rounded-3 bg-white sticky-top" style={{ top: '1rem' }}>
              <h6 className="fw-bold mb-3 text-uppercase text-secondary" style={{ fontSize: '0.8rem', letterSpacing: '0.5px' }}>
                <i className="bi bi-calculator me-2 text-success"></i>
                Financial Computation
              </h6>

              <div className="border rounded-2 p-3 bg-light mb-4">
                <div className="d-flex justify-content-between align-items-center mb-2 small">
                  <span className="text-muted">Subtotal (Net Deliverables):</span>
                  <span className="fw-semibold text-dark">{formatINR(subtotal)}</span>
                </div>
                <div className="d-flex justify-content-between align-items-center mb-2 small">
                  <span className="text-muted">Statutory GST ({taxPercent}%):</span>
                  <span className="fw-semibold text-info">+ {formatINR(taxAmount)}</span>
                </div>
                <hr className="my-2" />
                <div className="d-flex justify-content-between align-items-center">
                  <span className="fw-bold text-dark">Grand Total:</span>
                  <span className="h5 fw-bold text-success mb-0">{formatINR(totalAmount)}</span>
                </div>
              </div>

              <div className="alert alert-info py-2 px-3 small mb-4" role="alert">
                <i className="bi bi-shield-check me-2"></i>
                Statutory 18% GST calculation complies with Defence Financial Regulations (DFR 2024).
              </div>

              <div className="d-grid gap-2">
                <button
                  type="submit"
                  className="btn btn-navy py-2 fw-semibold d-flex align-items-center justify-content-center gap-2 shadow-sm"
                  disabled={submitting}
                >
                  {submitting ? (
                    <>
                      <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
                      <span>Recording Invoice...</span>
                    </>
                  ) : (
                    <>
                      <i className="bi bi-check2-circle"></i>
                      <span>Generate Defence Invoice</span>
                    </>
                  )}
                </button>

                <Link to="/app/finance/invoices" className="btn btn-outline-secondary py-2 small">
                  Cancel &amp; Discard
                </Link>
              </div>
            </div>
          </div>
        </div>
      </form>
    </div>
  )
}
