import { useState, useEffect } from 'react'
import { useNavigate, useSearchParams, Link } from 'react-router-dom'
import { createRequisition, createItem, getPlans } from '../../api/procurementApi.js'
import { formatINR } from '../../utils/formatters.js'

export default function RequisitionCreatePage() {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const preselectedPlan = searchParams.get('plan') || ''

  const [form, setForm] = useState({
    requisition_number: '',
    plan: preselectedPlan,
    title: '',
    priority: 'Medium',
    required_by_date: '',
    description: '',
  })

  // Line items state
  const [items, setItems] = useState([
    { item_name: '', description: '', quantity: '1', unit: 'Unit', unit_price: '' },
  ])

  const [plans, setPlans] = useState([])
  const [plansLoading, setPlansLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')
  const [fieldErrors, setFieldErrors] = useState({})

  useEffect(() => {
    getPlans({ page_size: 100 })
      .then(res => {
        const list = res.data?.data?.results || res.data?.results || res.data?.data || []
        setPlans(list)
        setForm(prev => {
          if (!prev.plan && list.length > 0) {
            return { ...prev, plan: preselectedPlan || String(list[0].id) }
          }
          return prev
        })
      })
      .catch(() => {})
      .finally(() => setPlansLoading(false))
  }, [preselectedPlan])

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
    setForm(prev => ({ ...prev, requisition_number: `REQ-2026-${randomNum}` }))
  }

  // Line Item Handlers
  const handleItemChange = (index, field, value) => {
    setItems(prev => {
      const copy = [...prev]
      copy[index] = { ...copy[index], [field]: value }
      return copy
    })
  }

  const handleAddItem = () => {
    setItems(prev => [
      ...prev,
      { item_name: '', description: '', quantity: '1', unit: 'Unit', unit_price: '' },
    ])
  }

  const handleRemoveItem = (index) => {
    if (items.length <= 1) return
    setItems(prev => prev.filter((_, i) => i !== index))
  }

  const totalCalculated = items.reduce((acc, it) => {
    const qty = parseFloat(it.quantity) || 0
    const price = parseFloat(it.unit_price) || 0
    return acc + (qty * price)
  }, 0)

  const validate = () => {
    const errs = {}

    if (!form.requisition_number.trim()) {
      errs.requisition_number = 'Requisition number is required.'
    }

    if (!form.plan) {
      errs.plan = 'Procurement plan selection is mandatory.'
    }

    if (!form.title.trim()) {
      errs.title = 'Requisition title is required.'
    }

    if (!form.required_by_date) {
      errs.required_by_date = 'Required-by delivery date is mandatory.'
    }

    // Validate line items
    for (let i = 0; i < items.length; i++) {
      const it = items[i]
      if (!it.item_name.trim()) {
        errs[`item_${i}_name`] = `Item #${i + 1} name is required.`
      }
      if (!it.quantity || parseFloat(it.quantity) <= 0) {
        errs[`item_${i}_qty`] = `Item #${i + 1} quantity must be > 0.`
      }
      if (!it.unit_price || parseFloat(it.unit_price) <= 0) {
        errs[`item_${i}_price`] = `Item #${i + 1} unit price must be > 0.`
      }
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
      // 1. Create Requisition
      const reqPayload = {
        requisition_number: form.requisition_number.trim(),
        plan: parseInt(form.plan, 10),
        title: form.title.trim(),
        priority: form.priority,
        required_by_date: form.required_by_date,
        description: form.description.trim(),
      }
      const res = await createRequisition(reqPayload)
      const created = res.data?.data ?? res.data
      const newId = created.id

      // 2. Attach Line Items
      if (newId && items.length > 0) {
        for (const it of items) {
          if (it.item_name.trim()) {
            await createItem({
              requisition: newId,
              item_name: it.item_name.trim(),
              description: it.description.trim(),
              quantity: parseFloat(it.quantity),
              unit: it.unit,
              unit_price: parseFloat(it.unit_price),
            })
          }
        }
      }

      navigate(`/app/procurement/requisitions/${newId}`)
    } catch (err) {
      const data = err.response?.data
      if (data?.errors) {
        setFieldErrors(data.errors)
      } else if (data?.message) {
        setError(data.message)
      } else {
        setError('Failed to submit requisition demand. Please review form entries.')
      }
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="container-fluid p-0" style={{ maxWidth: '1000px' }}>
      {/* Header */}
      <div className="d-flex align-items-center justify-content-between mb-4 pb-2 border-bottom">
        <div>
          <div className="d-flex align-items-center gap-2 mb-1">
            <h4 className="fw-bold mb-0" style={{ color: '#102A43' }}>Create Defence Requisition Indenture</h4>
            <span className="badge bg-secondary" style={{ fontSize: '0.7rem' }}>NEW DEMAND</span>
          </div>
          <p className="text-muted small mb-0">
            Submit equipment, ordnance, or service demand indentures with verified line item bills of quantity.
          </p>
        </div>
        <Link to="/app/procurement/requisitions" className="btn btn-outline-secondary btn-sm">
          <i className="bi bi-arrow-left me-1"></i>Back to Requisitions
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
        {/* Core Information */}
        <div className="card border-0 shadow-sm p-4 rounded-3 bg-white mb-4">
          <h6 className="fw-bold pb-2 mb-3 border-bottom text-uppercase small" style={{ color: '#102A43', letterSpacing: '0.5px' }}>
            <i className="bi bi-clipboard-data text-warning me-2"></i>1. Demand Indenture Identification
          </h6>

          <div className="row g-3">
            {/* Requisition Number */}
            <div className="col-md-6">
              <label className="form-label fw-semibold small" style={{ color: '#334E68' }}>
                Requisition Number <span className="text-danger">*</span>
              </label>
              <div className="input-group">
                <input
                  type="text"
                  name="requisition_number"
                  className={`form-control font-monospace ${fieldErrors.requisition_number ? 'is-invalid' : ''}`}
                  placeholder="e.g. REQ-2026-001"
                  value={form.requisition_number}
                  onChange={handleChange}
                  required
                />
                <button
                  type="button"
                  className="btn btn-outline-secondary btn-sm"
                  onClick={handleAutoGenerateNumber}
                  title="Generate Indenture Identifier"
                >
                  <i className="bi bi-magic me-1"></i>Auto
                </button>
                {fieldErrors.requisition_number && (
                  <div className="invalid-feedback d-block">{fieldErrors.requisition_number}</div>
                )}
              </div>
            </div>

            {/* Procurement Plan */}
            <div className="col-md-6">
              <label className="form-label fw-semibold small" style={{ color: '#334E68' }}>
                Procurement Master Plan <span className="text-danger">*</span>
              </label>
              <select
                name="plan"
                className={`form-select ${fieldErrors.plan ? 'is-invalid' : ''}`}
                value={form.plan}
                onChange={handleChange}
                disabled={plansLoading}
                required
              >
                <option value="">Select funding master plan...</option>
                {plans.map(p => (
                  <option key={p.id} value={p.id}>
                    {p.plan_number} &bull; {p.title} ({p.fiscal_year})
                  </option>
                ))}
              </select>
              {fieldErrors.plan && <div className="invalid-feedback">{fieldErrors.plan}</div>}
            </div>

            {/* Title */}
            <div className="col-12">
              <label className="form-label fw-semibold small" style={{ color: '#334E68' }}>
                Requisition Title / Indenture Purpose <span className="text-danger">*</span>
              </label>
              <input
                type="text"
                name="title"
                className={`form-control ${fieldErrors.title ? 'is-invalid' : ''}`}
                placeholder="e.g., Immediate Operational Requirement: High-Altitude Tactical Boots and Cold Weather Gear"
                value={form.title}
                onChange={handleChange}
                required
              />
              {fieldErrors.title && <div className="invalid-feedback">{fieldErrors.title}</div>}
            </div>

            {/* Priority */}
            <div className="col-md-6">
              <label className="form-label fw-semibold small" style={{ color: '#334E68' }}>
                Operational Priority <span className="text-danger">*</span>
              </label>
              <select
                name="priority"
                className="form-select"
                value={form.priority}
                onChange={handleChange}
              >
                <option value="Urgent">Urgent — Immediate Operational Requirement</option>
                <option value="High">High — Scheduled Mission Deployment</option>
                <option value="Medium">Medium — Standard Unit Replenishment</option>
                <option value="Low">Low — Routine Non-Critical Stock</option>
              </select>
            </div>

            {/* Required By Date */}
            <div className="col-md-6">
              <label className="form-label fw-semibold small" style={{ color: '#334E68' }}>
                Required-By Delivery Date <span className="text-danger">*</span>
              </label>
              <input
                type="date"
                name="required_by_date"
                className={`form-control ${fieldErrors.required_by_date ? 'is-invalid' : ''}`}
                value={form.required_by_date}
                onChange={handleChange}
                required
              />
              {fieldErrors.required_by_date && <div className="invalid-feedback">{fieldErrors.required_by_date}</div>}
            </div>

            {/* Description */}
            <div className="col-12">
              <label className="form-label fw-semibold small" style={{ color: '#334E68' }}>
                Indenture Justification &amp; Operational Deployment Notes
              </label>
              <textarea
                name="description"
                rows="3"
                className="form-control"
                placeholder="Provide tactical deployment reasoning, authorizing formation headquarters directive, and urgency rationale."
                value={form.description}
                onChange={handleChange}
              ></textarea>
            </div>
          </div>
        </div>

        {/* Bill of Quantities / Line Items Card */}
        <div className="card border-0 shadow-sm p-4 rounded-3 bg-white mb-4">
          <div className="d-flex justify-content-between align-items-center pb-2 mb-3 border-bottom">
            <h6 className="fw-bold mb-0 text-uppercase small" style={{ color: '#102A43', letterSpacing: '0.5px' }}>
              <i className="bi bi-list-check text-warning me-2"></i>2. Bill of Quantities &amp; Line Items
            </h6>
            <button
              type="button"
              className="btn btn-sm btn-outline-primary d-flex align-items-center gap-1"
              onClick={handleAddItem}
            >
              <i className="bi bi-plus-lg"></i>
              <span>Add Item</span>
            </button>
          </div>

          <div className="table-responsive mb-3">
            <table className="table table-bordered align-middle mb-0" style={{ fontSize: '0.84rem' }}>
              <thead className="table-light text-muted">
                <tr>
                  <th style={{ width: '30%' }}>Item Description &bull; Specs *</th>
                  <th style={{ width: '15%' }}>Quantity *</th>
                  <th style={{ width: '15%' }}>Unit</th>
                  <th style={{ width: '20%' }}>Unit Price (&#8377;) *</th>
                  <th style={{ width: '15%' }} className="text-end">Total Price</th>
                  <th style={{ width: '5%' }} className="text-center">Del</th>
                </tr>
              </thead>
              <tbody>
                {items.map((it, idx) => {
                  const lineTotal = (parseFloat(it.quantity) || 0) * (parseFloat(it.unit_price) || 0)
                  return (
                    <tr key={idx}>
                      <td>
                        <input
                          type="text"
                          className="form-control form-control-sm mb-1"
                          placeholder="Item name / Nomenclature *"
                          value={it.item_name}
                          onChange={(e) => handleItemChange(idx, 'item_name', e.target.value)}
                          required
                        />
                        <input
                          type="text"
                          className="form-control form-control-sm text-muted"
                          placeholder="Spec / Part #"
                          value={it.description}
                          onChange={(e) => handleItemChange(idx, 'description', e.target.value)}
                        />
                      </td>
                      <td>
                        <input
                          type="number"
                          step="0.01"
                          min="0.01"
                          className="form-control form-control-sm"
                          value={it.quantity}
                          onChange={(e) => handleItemChange(idx, 'quantity', e.target.value)}
                          required
                        />
                      </td>
                      <td>
                        <select
                          className="form-select form-select-sm"
                          value={it.unit}
                          onChange={(e) => handleItemChange(idx, 'unit', e.target.value)}
                        >
                          <option value="Unit">Unit</option>
                          <option value="Set">Set</option>
                          <option value="Piece">Piece</option>
                          <option value="Box">Box</option>
                          <option value="Kg">Kg</option>
                          <option value="Litre">Litre</option>
                          <option value="Metre">Metre</option>
                          <option value="Hour">Hour</option>
                        </select>
                      </td>
                      <td>
                        <div className="input-group input-group-sm">
                          <span className="input-group-text">&#8377;</span>
                          <input
                            type="number"
                            step="0.01"
                            min="0.01"
                            className="form-control form-control-sm font-monospace"
                            placeholder="0.00"
                            value={it.unit_price}
                            onChange={(e) => handleItemChange(idx, 'unit_price', e.target.value)}
                            required
                          />
                        </div>
                      </td>
                      <td className="text-end font-monospace fw-semibold text-dark">
                        {formatINR(lineTotal)}
                      </td>
                      <td className="text-center">
                        <button
                          type="button"
                          className="btn btn-sm btn-link text-danger p-0"
                          disabled={items.length <= 1}
                          onClick={() => handleRemoveItem(idx)}
                          title="Remove item"
                        >
                          <i className="bi bi-trash"></i>
                        </button>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
              <tfoot>
                <tr className="table-light">
                  <td colSpan="4" className="text-end fw-bold text-uppercase small" style={{ color: '#102A43' }}>
                    Total Estimated Requisition Value:
                  </td>
                  <td className="text-end font-monospace fw-bold h6 mb-0 text-success">
                    {formatINR(totalCalculated)}
                  </td>
                  <td></td>
                </tr>
              </tfoot>
            </table>
          </div>
        </div>

        {/* Action Controls */}
        <div className="d-flex justify-content-end gap-3 mb-5">
          <Link to="/app/procurement/requisitions" className="btn btn-outline-secondary px-4">
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
                <span>Submitting Indenture...</span>
              </>
            ) : (
              <>
                <i className="bi bi-send-check-fill text-warning"></i>
                <span>Submit Requisition for Approval</span>
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  )
}
