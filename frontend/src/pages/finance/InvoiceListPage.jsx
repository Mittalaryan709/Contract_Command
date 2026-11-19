import { useState, useEffect, useCallback, useMemo } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext.jsx'
import { getInvoices, deleteInvoice } from '../../api/financeApi.js'
import { getVendors } from '../../api/vendorApi.js'
import useDebounce from '../../hooks/useDebounce.js'
import StatusBadge from '../../components/common/StatusBadge.jsx'
import LoadingSpinner from '../../components/common/LoadingSpinner.jsx'
import EmptyState from '../../components/common/EmptyState.jsx'
import ConfirmDialog from '../../components/common/ConfirmDialog.jsx'
import { formatINR, formatDate } from '../../utils/formatters.js'

export default function InvoiceListPage() {
  const { canWrite, canDelete } = useAuth()
  const navigate = useNavigate()

  const [invoices, setInvoices] = useState([])
  const [vendors, setVendors] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [pagination, setPagination] = useState({ count: 0, next: null, previous: null, page: 1 })

  // Filters
  const [search, setSearch] = useState('')
  const debouncedSearch = useDebounce(search, 400)
  const [statusFilter, setStatusFilter] = useState('')
  const [vendorFilter, setVendorFilter] = useState('')

  // Delete modal
  const [deleteTarget, setDeleteTarget] = useState(null)
  const [deleteLoading, setDeleteLoading] = useState(false)
  const [feedbackMsg, setFeedbackMsg] = useState('')

  useEffect(() => {
    getVendors({ page_size: 100 })
      .then(res => {
        const list = res.data?.data?.results || res.data?.results || res.data?.data || []
        setVendors(list)
      })
      .catch(() => {})
  }, [])

  const fetchInvoices = useCallback(async (page = 1) => {
    setLoading(true)
    setError('')
    try {
      const params = {
        page,
        search: debouncedSearch.trim() || undefined,
        status: statusFilter || undefined,
        vendor: vendorFilter || undefined,
      }
      const res = await getInvoices(params)
      const data = res.data?.data ?? res.data
      const results = data.results || (Array.isArray(data) ? data : [])
      setInvoices(results)
      setPagination({
        count: data.count || results.length,
        next: data.next,
        previous: data.previous,
        page,
      })
    } catch (err) {
      setError(err.response?.data?.message || 'Unable to load invoice ledger.')
    } finally {
      setLoading(false)
    }
  }, [debouncedSearch, statusFilter, vendorFilter])

  useEffect(() => {
    fetchInvoices(1)
  }, [fetchInvoices])

  // Summary Metrics
  const stats = useMemo(() => {
    const totalInvoiced = invoices.reduce((acc, i) => acc + (parseFloat(i.total_amount) || 0), 0)
    const totalPaid = invoices.reduce((acc, i) => acc + (parseFloat(i.paid_amount) || 0), 0)
    const totalBalance = invoices.reduce((acc, i) => acc + (parseFloat(i.balance_amount) || 0), 0)
    const pendingCount = invoices.filter(i => i.status === 'Submitted' || i.status === 'Draft').length
    return { totalInvoiced, totalPaid, totalBalance, pendingCount }
  }, [invoices])

  const handleDeleteConfirm = async () => {
    if (!deleteTarget) return
    setDeleteLoading(true)
    try {
      await deleteInvoice(deleteTarget.id)
      setFeedbackMsg(`Invoice ${deleteTarget.invoice_number} deleted successfully.`)
      setDeleteTarget(null)
      fetchInvoices(pagination.page)
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to delete invoice.')
    } finally {
      setDeleteLoading(false)
    }
  }

  const handleClearFilters = () => {
    setSearch('')
    setStatusFilter('')
    setVendorFilter('')
  }

  return (
    <div className="container-fluid p-0">
      {/* Header */}
      <div className="d-flex flex-column flex-sm-row justify-content-between align-items-sm-center gap-3 mb-4 pb-2 border-bottom">
        <div>
          <div className="d-flex align-items-center gap-2 mb-1">
            <h4 className="fw-bold mb-0" style={{ color: '#102A43' }}>Defence Invoices &amp; GST Disbursements</h4>
            <span className="badge bg-secondary" style={{ fontSize: '0.7rem' }}>MODULE 4A</span>
          </div>
          <p className="text-muted small mb-0">
            Contractor billing, statutory 18% GST validation, and payment settlement tracking.
          </p>
        </div>

        <div className="d-flex gap-2">
          <Link to="/app/finance/payments" className="btn btn-outline-secondary btn-sm d-flex align-items-center gap-1">
            <i className="bi bi-cash-stack"></i>
            <span>Disbursement History</span>
          </Link>

          {canWrite() && (
            <Link to="/app/finance/invoices/new" className="btn btn-navy btn-sm d-flex align-items-center gap-2 shadow-sm">
              <i className="bi bi-receipt-cutoff text-warning"></i>
              <span>Generate Invoice</span>
            </Link>
          )}
        </div>
      </div>

      {/* Metrics Banner */}
      <div className="row g-3 mb-4">
        <div className="col-sm-6 col-lg-3">
          <div className="card border-0 shadow-sm p-3 rounded-3 bg-white h-100 border-start border-4 border-primary">
            <div className="text-muted small fw-semibold text-uppercase">Total Invoiced (Page)</div>
            <div className="h4 fw-bold my-1 text-dark">{formatINR(stats.totalInvoiced)}</div>
            <div className="text-muted" style={{ fontSize: '0.75rem' }}>Gross claims filed</div>
          </div>
        </div>
        <div className="col-sm-6 col-lg-3">
          <div className="card border-0 shadow-sm p-3 rounded-3 bg-white h-100 border-start border-4 border-success">
            <div className="text-muted small fw-semibold text-uppercase">Total Disbursed</div>
            <div className="h4 fw-bold my-1 text-success">{formatINR(stats.totalPaid)}</div>
            <div className="text-muted" style={{ fontSize: '0.75rem' }}>RTGS / NEFT cleared</div>
          </div>
        </div>
        <div className="col-sm-6 col-lg-3">
          <div className="card border-0 shadow-sm p-3 rounded-3 bg-white h-100 border-start border-4 border-warning">
            <div className="text-muted small fw-semibold text-uppercase">Outstanding Balance</div>
            <div className="h4 fw-bold my-1 text-warning">{formatINR(stats.totalBalance)}</div>
            <div className="text-muted" style={{ fontSize: '0.75rem' }}>Pending disbursement</div>
          </div>
        </div>
        <div className="col-sm-6 col-lg-3">
          <div className="card border-0 shadow-sm p-3 rounded-3 bg-white h-100 border-start border-4 border-info">
            <div className="text-muted small fw-semibold text-uppercase">Pending Scrutiny</div>
            <div className="h3 fw-bold my-1 text-info">{stats.pendingCount}</div>
            <div className="text-muted" style={{ fontSize: '0.75rem' }}>Awaiting audit clearance</div>
          </div>
        </div>
      </div>

      {/* Feedback Message */}
      {feedbackMsg && (
        <div className="alert alert-success alert-dismissible fade show d-flex align-items-center gap-2 small mb-4" role="alert">
          <i className="bi bi-check-circle-fill text-success"></i>
          <span className="flex-grow-1">{feedbackMsg}</span>
          <button type="button" className="btn-close" onClick={() => setFeedbackMsg('')}></button>
        </div>
      )}

      {/* Error Message */}
      {error && (
        <div className="alert alert-danger d-flex align-items-center gap-2 small mb-4" role="alert">
          <i className="bi bi-exclamation-octagon-fill text-danger flex-shrink-0"></i>
          <span className="flex-grow-1">{error}</span>
          <button type="button" className="btn btn-sm btn-outline-danger" onClick={() => fetchInvoices(pagination.page)}>Retry</button>
        </div>
      )}

      {/* Filter and Search Bar */}
      <div className="card border-0 shadow-sm p-3 mb-4 rounded-3 bg-white">
        <div className="row g-2 align-items-center">
          <div className="col-md-5">
            <div className="input-group input-group-sm">
              <span className="input-group-text bg-light border-end-0">
                <i className="bi bi-search text-muted"></i>
              </span>
              <input
                type="text"
                className="form-control border-start-0"
                placeholder="Search invoice #, contract #, or vendor name..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
              {search && (
                <button className="btn btn-outline-secondary" type="button" onClick={() => setSearch('')}>
                  <i className="bi bi-x"></i>
                </button>
              )}
            </div>
          </div>

          <div className="col-sm-4 col-md-3">
            <select
              className="form-select form-select-sm"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              aria-label="Filter by Status"
            >
              <option value="">All Statuses</option>
              <option value="Draft">Draft</option>
              <option value="Submitted">Submitted</option>
              <option value="Approved">Approved</option>
              <option value="Paid">Paid</option>
              <option value="Overdue">Overdue</option>
              <option value="Cancelled">Cancelled</option>
            </select>
          </div>

          <div className="col-sm-4 col-md-3">
            <select
              className="form-select form-select-sm"
              value={vendorFilter}
              onChange={(e) => setVendorFilter(e.target.value)}
              aria-label="Filter by Vendor"
            >
              <option value="">All Suppliers</option>
              {vendors.map(v => (
                <option key={v.id} value={v.id}>{v.company_name}</option>
              ))}
            </select>
          </div>

          <div className="col-auto">
            <button
              type="button"
              className="btn btn-sm btn-outline-secondary d-flex align-items-center gap-1"
              onClick={handleClearFilters}
              title="Reset filters"
            >
              <i className="bi bi-arrow-counterclockwise"></i>
              <span>Reset</span>
            </button>
          </div>
        </div>
      </div>

      {/* Invoices Table */}
      <div className="card border-0 shadow-sm rounded-3 bg-white overflow-hidden">
        {loading ? (
          <div className="p-5 text-center">
            <LoadingSpinner message="Querying Defence Invoice Ledger..." />
          </div>
        ) : invoices.length === 0 ? (
          <div className="p-5">
            <EmptyState
              title="No Invoices Located"
              message={search || statusFilter || vendorFilter
                ? 'No invoices match your active filters. Try resetting search parameters.'
                : 'No contractor invoices filed in the repository yet.'}
              actionText={canWrite() ? 'Create Initial Invoice' : null}
              onAction={canWrite() ? () => navigate('/app/finance/invoices/new') : null}
            />
          </div>
        ) : (
          <>
            <div className="table-responsive">
              <table className="table table-hover align-middle mb-0" style={{ fontSize: '0.86rem' }}>
                <thead className="table-light text-uppercase text-muted" style={{ fontSize: '0.72rem', letterSpacing: '0.5px' }}>
                  <tr>
                    <th scope="col" className="ps-3">Invoice #</th>
                    <th scope="col">Vendor &bull; Contract</th>
                    <th scope="col">Dates</th>
                    <th scope="col" className="text-end">Subtotal</th>
                    <th scope="col" className="text-end">GST (18%)</th>
                    <th scope="col" className="text-end">Total Amount</th>
                    <th scope="col" className="text-end">Balance</th>
                    <th scope="col">Status</th>
                    <th scope="col" className="text-end pe-3">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {invoices.map(inv => (
                    <tr key={inv.id}>
                      {/* Invoice # */}
                      <td className="ps-3 fw-semibold">
                        <Link
                          to={`/app/finance/invoices/${inv.id}`}
                          className="font-monospace text-decoration-none text-primary"
                        >
                          {inv.invoice_number}
                        </Link>
                      </td>

                      {/* Vendor & Contract */}
                      <td>
                        <div className="fw-semibold text-dark text-truncate" style={{ maxWidth: '200px' }}>
                          {inv.vendor_name || `Vendor #${inv.vendor}`}
                        </div>
                        <div className="text-muted font-monospace" style={{ fontSize: '0.72rem' }}>
                          Contract: {inv.contract_number || `CC #${inv.contract}`}
                        </div>
                      </td>

                      {/* Dates */}
                      <td>
                        <div className="text-dark small">Inv: {formatDate(inv.invoice_date)}</div>
                        <div className="text-muted" style={{ fontSize: '0.72rem' }}>Due: {formatDate(inv.due_date)}</div>
                      </td>

                      {/* Subtotal */}
                      <td className="text-end font-monospace text-secondary">
                        {formatINR(inv.subtotal)}
                      </td>

                      {/* GST */}
                      <td className="text-end font-monospace text-muted small">
                        {formatINR(inv.tax_amount)}
                      </td>

                      {/* Total */}
                      <td className="text-end font-monospace fw-semibold text-dark">
                        {formatINR(inv.total_amount)}
                      </td>

                      {/* Balance */}
                      <td className="text-end font-monospace fw-bold">
                        {parseFloat(inv.balance_amount) > 0 ? (
                          <span className="text-warning">{formatINR(inv.balance_amount)}</span>
                        ) : (
                          <span className="text-success">&#8377;0.00</span>
                        )}
                      </td>

                      {/* Status */}
                      <td>
                        <StatusBadge status={inv.status} />
                      </td>

                      {/* Actions */}
                      <td className="text-end pe-3">
                        <div className="d-inline-flex align-items-center gap-1">
                          <Link
                            to={`/app/finance/invoices/${inv.id}`}
                            className="btn btn-sm btn-outline-secondary p-1 px-2"
                            title="View invoice & payments"
                          >
                            <i className="bi bi-eye"></i>
                          </Link>

                          {/* Quick Pay link if balance remains */}
                          {parseFloat(inv.balance_amount) > 0 && inv.status !== 'Draft' && (
                            <Link
                              to={`/app/finance/payments/new?invoice=${inv.id}`}
                              className="btn btn-sm btn-outline-success p-1 px-2"
                              title="Record payment disbursement"
                            >
                              <i className="bi bi-cash-coin"></i>
                            </Link>
                          )}

                          {canDelete() && (
                            <button
                              type="button"
                              className="btn btn-sm btn-outline-danger p-1 px-2"
                              title="Delete invoice"
                              onClick={() => setDeleteTarget(inv)}
                            >
                              <i className="bi bi-trash"></i>
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Pagination footer */}
            <div className="d-flex flex-column flex-sm-row justify-content-between align-items-center p-3 border-top bg-light small">
              <span className="text-muted mb-2 mb-sm-0">
                Showing {invoices.length} of {pagination.count} invoices
              </span>

              <div className="d-flex align-items-center gap-2">
                <button
                  type="button"
                  className="btn btn-sm btn-outline-secondary px-3"
                  disabled={!pagination.previous || loading}
                  onClick={() => fetchInvoices(pagination.page - 1)}
                >
                  <i className="bi bi-chevron-left me-1"></i>Previous
                </button>
                <span className="badge bg-white text-dark border px-2 py-1">
                  Page {pagination.page}
                </span>
                <button
                  type="button"
                  className="btn btn-sm btn-outline-secondary px-3"
                  disabled={!pagination.next || loading}
                  onClick={() => fetchInvoices(pagination.page + 1)}
                >
                  Next<i className="bi bi-chevron-right ms-1"></i>
                </button>
              </div>
            </div>
          </>
        )}
      </div>

      {/* Delete Confirmation Modal */}
      <ConfirmDialog
        show={!!deleteTarget}
        title="Permanently Delete Invoice Record"
        message={
          deleteTarget
            ? `Are you certain you wish to permanently delete invoice ${deleteTarget.invoice_number}? This action requires Administrator clearance.`
            : ''
        }
        variant="danger"
        loading={deleteLoading}
        onConfirm={handleDeleteConfirm}
        onCancel={() => setDeleteTarget(null)}
      />
    </div>
  )
}
