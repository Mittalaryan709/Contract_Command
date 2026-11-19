import { useState, useEffect, useCallback } from 'react'
import { useParams, Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext.jsx'
import { getInvoice, updateInvoice, deleteInvoice } from '../../api/financeApi.js'
import StatusBadge from '../../components/common/StatusBadge.jsx'
import LoadingSpinner from '../../components/common/LoadingSpinner.jsx'
import ConfirmDialog from '../../components/common/ConfirmDialog.jsx'
import { formatINR, formatDate } from '../../utils/formatters.js'

export default function InvoiceDetailPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { canWrite, canDelete } = useAuth()

  const [invoice, setInvoice] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [feedbackMsg, setFeedbackMsg] = useState('')

  // Status transition state
  const [statusUpdating, setStatusUpdating] = useState(false)

  // Delete dialog state
  const [showDeleteDialog, setShowDeleteDialog] = useState(false)
  const [deleting, setDeleting] = useState(false)

  const fetchInvoiceDetail = useCallback(async () => {
    setLoading(true)
    setError('')
    try {
      const res = await getInvoice(id)
      const data = res.data?.data ?? res.data
      setInvoice(data)
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to retrieve invoice details.')
    } finally {
      setLoading(false)
    }
  }, [id])

  useEffect(() => {
    fetchInvoiceDetail()
  }, [fetchInvoiceDetail])

  // Handle status update
  const handleStatusChange = async (newStatus) => {
    setStatusUpdating(true)
    try {
      await updateInvoice(id, {
        status: newStatus,
        contract: invoice.contract,
        vendor: invoice.vendor,
        invoice_number: invoice.invoice_number,
        invoice_date: invoice.invoice_date,
        due_date: invoice.due_date,
        tax_percent: invoice.tax_percent,
      })
      setFeedbackMsg(`Invoice status updated to ${newStatus}.`)
      fetchInvoiceDetail()
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update invoice status.')
    } finally {
      setStatusUpdating(false)
    }
  }

  // Handle delete
  const handleDeleteInvoice = async () => {
    setDeleting(true)
    try {
      await deleteInvoice(id)
      navigate('/app/finance/invoices', { replace: true })
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to delete invoice.')
      setDeleting(false)
      setShowDeleteDialog(false)
    }
  }

  if (loading) {
    return (
      <div className="py-5">
        <LoadingSpinner text="Retrieving invoice records..." />
      </div>
    )
  }

  if (error || !invoice) {
    return (
      <div className="container-fluid p-0">
        <div className="alert alert-danger d-flex align-items-center gap-2 mb-4">
          <i className="bi bi-exclamation-octagon-fill"></i>
          <span className="flex-grow-1">{error || 'Invoice not found.'}</span>
          <Link to="/app/finance/invoices" className="btn btn-sm btn-outline-danger">Back to Ledger</Link>
        </div>
      </div>
    )
  }

  const items = invoice.items || []
  const payments = invoice.payments || []
  const paidAmount = parseFloat(invoice.paid_amount) || 0
  const balanceAmount = parseFloat(invoice.balance_amount) !== undefined ? parseFloat(invoice.balance_amount) : (parseFloat(invoice.total_amount) - paidAmount)

  return (
    <div className="container-fluid p-0">
      {/* Header */}
      <div className="d-flex flex-column flex-sm-row justify-content-between align-items-sm-center gap-3 mb-4 pb-2 border-bottom">
        <div>
          <div className="d-flex align-items-center gap-2 mb-1">
            <h4 className="fw-bold mb-0" style={{ color: '#102A43' }}>
              Invoice {invoice.invoice_number}
            </h4>
            <StatusBadge status={invoice.status} />
          </div>
          <p className="text-muted small mb-0">
            Defence Procurement Settlement &bull; Contract: {invoice.contract_number || `Contract #${invoice.contract}`}
          </p>
        </div>

        <div className="d-flex flex-wrap gap-2">
          <Link to="/app/finance/invoices" className="btn btn-outline-secondary btn-sm d-flex align-items-center gap-1">
            <i className="bi bi-arrow-left"></i>
            <span>Back to Invoices</span>
          </Link>

          {canWrite() && balanceAmount > 0 && (
            <Link
              to={`/app/finance/payments/new?invoice=${invoice.id}`}
              className="btn btn-success btn-sm d-flex align-items-center gap-1 shadow-sm"
            >
              <i className="bi bi-credit-card"></i>
              <span>Record Payment</span>
            </Link>
          )}

          {canDelete() && (
            <button
              type="button"
              className="btn btn-outline-danger btn-sm d-flex align-items-center gap-1"
              onClick={() => setShowDeleteDialog(true)}
            >
              <i className="bi bi-trash"></i>
              <span>Delete</span>
            </button>
          )}
        </div>
      </div>

      {/* Feedback Alert */}
      {feedbackMsg && (
        <div className="alert alert-success alert-dismissible fade show d-flex align-items-center gap-2 small mb-4" role="alert">
          <i className="bi bi-check-circle-fill text-success"></i>
          <span className="flex-grow-1">{feedbackMsg}</span>
          <button type="button" className="btn-close" onClick={() => setFeedbackMsg('')}></button>
        </div>
      )}

      {/* Metrics Banner */}
      <div className="row g-3 mb-4">
        <div className="col-sm-6 col-lg-3">
          <div className="card border-0 shadow-sm p-3 rounded-3 bg-white h-100 border-start border-4 border-primary">
            <div className="text-muted small fw-semibold text-uppercase">Total Invoiced</div>
            <div className="h4 fw-bold my-1 text-dark">{formatINR(invoice.total_amount)}</div>
            <div className="text-muted" style={{ fontSize: '0.75rem' }}>Inclusive of 18% GST</div>
          </div>
        </div>
        <div className="col-sm-6 col-lg-3">
          <div className="card border-0 shadow-sm p-3 rounded-3 bg-white h-100 border-start border-4 border-success">
            <div className="text-muted small fw-semibold text-uppercase">Disbursed to Date</div>
            <div className="h4 fw-bold my-1 text-success">{formatINR(paidAmount)}</div>
            <div className="text-muted" style={{ fontSize: '0.75rem' }}>Cleared payments</div>
          </div>
        </div>
        <div className="col-sm-6 col-lg-3">
          <div className="card border-0 shadow-sm p-3 rounded-3 bg-white h-100 border-start border-4 border-warning">
            <div className="text-muted small fw-semibold text-uppercase">Outstanding Balance</div>
            <div className="h4 fw-bold my-1 text-warning">{formatINR(balanceAmount)}</div>
            <div className="text-muted" style={{ fontSize: '0.75rem' }}>Remaining payable</div>
          </div>
        </div>
        <div className="col-sm-6 col-lg-3">
          <div className="card border-0 shadow-sm p-3 rounded-3 bg-white h-100 border-start border-4 border-info">
            <div className="text-muted small fw-semibold text-uppercase">GST Levy ({invoice.tax_percent}%)</div>
            <div className="h4 fw-bold my-1 text-info">{formatINR(invoice.tax_amount)}</div>
            <div className="text-muted" style={{ fontSize: '0.75rem' }}>Subtotal: {formatINR(invoice.subtotal)}</div>
          </div>
        </div>
      </div>

      <div className="row g-4">
        {/* Left Column: Details & Items */}
        <div className="col-lg-8">
          {/* Metadata Card */}
          <div className="card border-0 shadow-sm p-4 rounded-3 bg-white mb-4">
            <div className="d-flex justify-content-between align-items-center mb-3">
              <h6 className="fw-bold mb-0 text-uppercase text-secondary" style={{ fontSize: '0.8rem', letterSpacing: '0.5px' }}>
                <i className="bi bi-file-text me-2 text-primary"></i>
                Invoice Specification
              </h6>

              {canWrite() && (
                <div className="d-flex align-items-center gap-2">
                  <span className="small text-muted">Change Status:</span>
                  <select
                    className="form-select form-select-sm"
                    style={{ width: 'auto' }}
                    value={invoice.status}
                    onChange={(e) => handleStatusChange(e.target.value)}
                    disabled={statusUpdating}
                  >
                    <option value="Draft">Draft</option>
                    <option value="Submitted">Submitted</option>
                    <option value="Approved">Approved</option>
                    <option value="Paid">Paid</option>
                    <option value="Overdue">Overdue</option>
                    <option value="Cancelled">Cancelled</option>
                  </select>
                </div>
              )}
            </div>

            <div className="row g-3">
              <div className="col-sm-6">
                <span className="text-muted small d-block">Contractor / Supplier:</span>
                <Link to={`/app/vendors/${invoice.vendor}`} className="fw-bold text-decoration-none">
                  {invoice.vendor_name || `Vendor #${invoice.vendor}`}
                </Link>
              </div>

              <div className="col-sm-6">
                <span className="text-muted small d-block">Defence Contract:</span>
                <Link to={`/app/contracts/${invoice.contract}`} className="fw-bold text-decoration-none">
                  {invoice.contract_number || `Contract #${invoice.contract}`}
                </Link>
              </div>

              <div className="col-sm-6">
                <span className="text-muted small d-block">Invoice Date:</span>
                <span className="fw-semibold text-dark">{formatDate(invoice.invoice_date)}</span>
              </div>

              <div className="col-sm-6">
                <span className="text-muted small d-block">Payment Due Date:</span>
                <span className="fw-semibold text-dark">{formatDate(invoice.due_date)}</span>
              </div>

              <div className="col-sm-6">
                <span className="text-muted small d-block">Generated By:</span>
                <span className="fw-semibold text-dark">{invoice.created_by_name || 'System Auditor'}</span>
              </div>

              <div className="col-sm-6">
                <span className="text-muted small d-block">Filing Date:</span>
                <span className="fw-semibold text-dark">{formatDate(invoice.created_at)}</span>
              </div>

              {invoice.notes && (
                <div className="col-12">
                  <span className="text-muted small d-block">Audit Notes &amp; Remarks:</span>
                  <div className="p-2 rounded bg-light border text-secondary small">
                    {invoice.notes}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Line Items Card */}
          <div className="card border-0 shadow-sm p-4 rounded-3 bg-white mb-4">
            <h6 className="fw-bold mb-3 text-uppercase text-secondary" style={{ fontSize: '0.8rem', letterSpacing: '0.5px' }}>
              <i className="bi bi-receipt me-2 text-primary"></i>
              Itemized Deliverables &amp; Milestones ({items.length})
            </h6>

            <div className="table-responsive">
              <table className="table table-bordered table-sm align-middle mb-0">
                <thead className="table-light">
                  <tr>
                    <th style={{ width: '5%' }} className="text-center">#</th>
                    <th style={{ width: '45%' }}>Description</th>
                    <th style={{ width: '15%' }} className="text-end">Quantity</th>
                    <th style={{ width: '15%' }} className="text-end">Unit Price (₹)</th>
                    <th style={{ width: '20%' }} className="text-end">Line Total (₹)</th>
                  </tr>
                </thead>
                <tbody>
                  {items.length === 0 ? (
                    <tr>
                      <td colSpan="5" className="text-center text-muted py-3">
                        No itemized deliverables attached to this invoice.
                      </td>
                    </tr>
                  ) : (
                    items.map((item, idx) => (
                      <tr key={item.id || idx}>
                        <td className="text-center text-muted small">{idx + 1}</td>
                        <td className="fw-semibold text-dark">{item.description}</td>
                        <td className="text-end">{item.quantity}</td>
                        <td className="text-end">{formatINR(item.unit_price)}</td>
                        <td className="text-end fw-bold text-dark">{formatINR(item.line_total)}</td>
                      </tr>
                    ))
                  )}
                </tbody>
                <tfoot className="table-light">
                  <tr>
                    <td colSpan="4" className="text-end fw-semibold">Subtotal:</td>
                    <td className="text-end fw-bold">{formatINR(invoice.subtotal)}</td>
                  </tr>
                  <tr>
                    <td colSpan="4" className="text-end fw-semibold text-info">GST ({invoice.tax_percent}%):</td>
                    <td className="text-end fw-bold text-info">+ {formatINR(invoice.tax_amount)}</td>
                  </tr>
                  <tr className="table-active">
                    <td colSpan="4" className="text-end fw-bold text-uppercase">Total Amount Payable:</td>
                    <td className="text-end fw-bold text-success h6 mb-0">{formatINR(invoice.total_amount)}</td>
                  </tr>
                </tfoot>
              </table>
            </div>
          </div>

          {/* Payments Ledger Card */}
          <div className="card border-0 shadow-sm p-4 rounded-3 bg-white">
            <div className="d-flex justify-content-between align-items-center mb-3">
              <h6 className="fw-bold mb-0 text-uppercase text-secondary" style={{ fontSize: '0.8rem', letterSpacing: '0.5px' }}>
                <i className="bi bi-cash-stack me-2 text-success"></i>
                Disbursement &amp; Payment History ({payments.length})
              </h6>

              {canWrite() && balanceAmount > 0 && (
                <Link
                  to={`/app/finance/payments/new?invoice=${invoice.id}`}
                  className="btn btn-outline-success btn-sm d-flex align-items-center gap-1"
                >
                  <i className="bi bi-plus-circle"></i>
                  <span>Add Payment</span>
                </Link>
              )}
            </div>

            {payments.length === 0 ? (
              <div className="text-center py-4 text-muted bg-light rounded">
                <i className="bi bi-wallet2 display-6 d-block mb-2 text-secondary opacity-50"></i>
                <div className="fw-semibold">No disbursements recorded yet</div>
                <div className="small">Payments made against this invoice will appear in this ledger.</div>
              </div>
            ) : (
              <div className="table-responsive">
                <table className="table table-hover table-sm align-middle mb-0">
                  <thead className="table-light">
                    <tr>
                      <th>Reference #</th>
                      <th>Date</th>
                      <th>Method</th>
                      <th>Status</th>
                      <th className="text-end">Amount (₹)</th>
                      <th>Remarks</th>
                    </tr>
                  </thead>
                  <tbody>
                    {payments.map(p => (
                      <tr key={p.id}>
                        <td className="fw-bold font-monospace text-primary">{p.payment_reference}</td>
                        <td className="small">{formatDate(p.payment_date)}</td>
                        <td>
                          <span className="badge bg-light text-dark border">{p.payment_method}</span>
                        </td>
                        <td>
                          <StatusBadge status={p.status} />
                        </td>
                        <td className="text-end fw-bold text-success">{formatINR(p.amount)}</td>
                        <td className="small text-muted">{p.remarks || '—'}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>

        {/* Right Column: Actions & Summary */}
        <div className="col-lg-4">
          <div className="card border-0 shadow-sm p-4 rounded-3 bg-white mb-4">
            <h6 className="fw-bold mb-3 text-uppercase text-secondary" style={{ fontSize: '0.8rem', letterSpacing: '0.5px' }}>
              <i className="bi bi-pie-chart me-2 text-primary"></i>
              Settlement Status
            </h6>

            <div className="progress mb-3" style={{ height: '10px' }}>
              <div
                className="progress-bar bg-success"
                role="progressbar"
                style={{
                  width: `${parseFloat(invoice.total_amount) > 0 ? Math.min(100, Math.round((paidAmount / parseFloat(invoice.total_amount)) * 100)) : 0}%`,
                }}
                aria-valuenow={paidAmount}
                aria-valuemin="0"
                aria-valuemax={invoice.total_amount}
              ></div>
            </div>

            <div className="d-flex justify-content-between small text-muted mb-3">
              <span>Paid: {formatINR(paidAmount)}</span>
              <span>
                {parseFloat(invoice.total_amount) > 0
                  ? `${Math.min(100, Math.round((paidAmount / parseFloat(invoice.total_amount)) * 100))}%`
                  : '0%'}
              </span>
            </div>

            <div className="border rounded p-3 bg-light mb-3">
              <div className="d-flex justify-content-between mb-1 small">
                <span className="text-muted">Total Claimed:</span>
                <span className="fw-semibold">{formatINR(invoice.total_amount)}</span>
              </div>
              <div className="d-flex justify-content-between mb-1 small">
                <span className="text-muted">Disbursed (RTGS/NEFT):</span>
                <span className="fw-semibold text-success">{formatINR(paidAmount)}</span>
              </div>
              <hr className="my-2" />
              <div className="d-flex justify-content-between">
                <span className="fw-bold text-dark">Outstanding:</span>
                <span className="fw-bold text-danger">{formatINR(balanceAmount)}</span>
              </div>
            </div>

            {balanceAmount <= 0 ? (
              <div className="alert alert-success d-flex align-items-center gap-2 py-2 px-3 small mb-0">
                <i className="bi bi-patch-check-fill text-success fs-5"></i>
                <span>Invoice fully settled. All disbursements cleared.</span>
              </div>
            ) : (
              <div className="alert alert-warning py-2 px-3 small mb-0">
                <i className="bi bi-clock-history me-1"></i>
                Settlement pending. Disburse remaining {formatINR(balanceAmount)} before {formatDate(invoice.due_date)}.
              </div>
            )}
          </div>

          <div className="card border-0 shadow-sm p-4 rounded-3 bg-white">
            <h6 className="fw-bold mb-3 text-uppercase text-secondary" style={{ fontSize: '0.8rem', letterSpacing: '0.5px' }}>
              <i className="bi bi-shield-lock me-2 text-warning"></i>
              Audit &amp; Compliance
            </h6>
            <p className="small text-muted mb-3">
              Defence Financial Regulations require validation of technical delivery certificates prior to final RTGS disbursement.
            </p>
            <div className="d-grid gap-2">
              <button
                type="button"
                className="btn btn-outline-secondary btn-sm d-flex align-items-center justify-content-center gap-1"
                onClick={() => window.print()}
              >
                <i className="bi bi-printer"></i>
                <span>Print Official Voucher</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Delete Dialog */}
      <ConfirmDialog
        show={showDeleteDialog}
        title="Delete Defence Invoice"
        message={`Are you sure you want to delete invoice ${invoice.invoice_number}? This will permanently remove all associated line items and records.`}
        confirmText="Confirm Delete"
        confirmVariant="danger"
        loading={deleting}
        onConfirm={handleDeleteInvoice}
        onCancel={() => setShowDeleteDialog(false)}
      />
    </div>
  )
}
