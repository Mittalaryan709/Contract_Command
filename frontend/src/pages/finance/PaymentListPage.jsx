import { useState, useEffect, useCallback, useMemo } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext.jsx'
import { getPayments } from '../../api/financeApi.js'
import useDebounce from '../../hooks/useDebounce.js'
import StatusBadge from '../../components/common/StatusBadge.jsx'
import LoadingSpinner from '../../components/common/LoadingSpinner.jsx'
import EmptyState from '../../components/common/EmptyState.jsx'
import { formatINR, formatDate } from '../../utils/formatters.js'

export default function PaymentListPage() {
  const { canWrite } = useAuth()

  const [payments, setPayments] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [pagination, setPagination] = useState({ count: 0, next: null, previous: null, page: 1 })

  // Filters
  const [search, setSearch] = useState('')
  const debouncedSearch = useDebounce(search, 400)
  const [statusFilter, setStatusFilter] = useState('')
  const [methodFilter, setMethodFilter] = useState('')

  const fetchPayments = useCallback(async (page = 1) => {
    setLoading(true)
    setError('')
    try {
      const params = {
        page,
        search: debouncedSearch.trim() || undefined,
        status: statusFilter || undefined,
        payment_method: methodFilter || undefined,
      }
      const res = await getPayments(params)
      const data = res.data?.data ?? res.data
      const results = data.results || (Array.isArray(data) ? data : [])
      setPayments(results)
      setPagination({
        count: data.count || results.length,
        next: data.next,
        previous: data.previous,
        page,
      })
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to retrieve payment records.')
    } finally {
      setLoading(false)
    }
  }, [debouncedSearch, statusFilter, methodFilter])

  useEffect(() => {
    fetchPayments(1)
  }, [fetchPayments])

  // Summary Metrics
  const stats = useMemo(() => {
    const totalDisbursed = payments
      .filter(p => p.status === 'Completed')
      .reduce((acc, p) => acc + (parseFloat(p.amount) || 0), 0)
    const completedCount = payments.filter(p => p.status === 'Completed').length
    const processingCount = payments.filter(p => p.status === 'Processing' || p.status === 'Initiated').length
    const issuesCount = payments.filter(p => p.status === 'Failed' || p.status === 'Reversed').length

    return { totalDisbursed, completedCount, processingCount, issuesCount }
  }, [payments])

  const handleClearFilters = () => {
    setSearch('')
    setStatusFilter('')
    setMethodFilter('')
  }

  return (
    <div className="container-fluid p-0">
      {/* Header */}
      <div className="d-flex flex-column flex-sm-row justify-content-between align-items-sm-center gap-3 mb-4 pb-2 border-bottom">
        <div>
          <div className="d-flex align-items-center gap-2 mb-1">
            <h4 className="fw-bold mb-0" style={{ color: '#102A43' }}>Payment Disbursements Ledger</h4>
            <span className="badge bg-secondary" style={{ fontSize: '0.7rem' }}>MODULE 4B</span>
          </div>
          <p className="text-muted small mb-0">
            Official RTGS/NEFT defence procurement banking settlements and treasury audit trail.
          </p>
        </div>

        <div className="d-flex gap-2">
          <Link to="/app/finance/invoices" className="btn btn-outline-secondary btn-sm d-flex align-items-center gap-1">
            <i className="bi bi-receipt"></i>
            <span>Invoice Ledger</span>
          </Link>

          {canWrite() && (
            <Link to="/app/finance/payments/new" className="btn btn-navy btn-sm d-flex align-items-center gap-2 shadow-sm">
              <i className="bi bi-plus-circle text-warning"></i>
              <span>Record Payment</span>
            </Link>
          )}
        </div>
      </div>

      {/* Metrics Banner */}
      <div className="row g-3 mb-4">
        <div className="col-sm-6 col-lg-3">
          <div className="card border-0 shadow-sm p-3 rounded-3 bg-white h-100 border-start border-4 border-success">
            <div className="text-muted small fw-semibold text-uppercase">Total Settled</div>
            <div className="h4 fw-bold my-1 text-success">{formatINR(stats.totalDisbursed)}</div>
            <div className="text-muted" style={{ fontSize: '0.75rem' }}>Completed disbursements</div>
          </div>
        </div>
        <div className="col-sm-6 col-lg-3">
          <div className="card border-0 shadow-sm p-3 rounded-3 bg-white h-100 border-start border-4 border-primary">
            <div className="text-muted small fw-semibold text-uppercase">Completed Transfers</div>
            <div className="h3 fw-bold my-1 text-primary">{stats.completedCount}</div>
            <div className="text-muted" style={{ fontSize: '0.75rem' }}>Cleared by treasury</div>
          </div>
        </div>
        <div className="col-sm-6 col-lg-3">
          <div className="card border-0 shadow-sm p-3 rounded-3 bg-white h-100 border-start border-4 border-warning">
            <div className="text-muted small fw-semibold text-uppercase">In Transmission</div>
            <div className="h3 fw-bold my-1 text-warning">{stats.processingCount}</div>
            <div className="text-muted" style={{ fontSize: '0.75rem' }}>Initiated / Processing</div>
          </div>
        </div>
        <div className="col-sm-6 col-lg-3">
          <div className="card border-0 shadow-sm p-3 rounded-3 bg-white h-100 border-start border-4 border-danger">
            <div className="text-muted small fw-semibold text-uppercase">Failed / Reversed</div>
            <div className="h3 fw-bold my-1 text-danger">{stats.issuesCount}</div>
            <div className="text-muted" style={{ fontSize: '0.75rem' }}>Requires treasury scrutiny</div>
          </div>
        </div>
      </div>

      {/* Error Alert */}
      {error && (
        <div className="alert alert-danger d-flex align-items-center gap-2 small mb-4" role="alert">
          <i className="bi bi-exclamation-octagon-fill text-danger flex-shrink-0"></i>
          <span className="flex-grow-1">{error}</span>
          <button type="button" className="btn btn-sm btn-outline-danger" onClick={() => fetchPayments(pagination.page)}>Retry</button>
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
                placeholder="Search reference #, invoice #, or remarks..."
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
              value={methodFilter}
              onChange={(e) => setMethodFilter(e.target.value)}
              aria-label="Filter by Method"
            >
              <option value="">All Payment Modes</option>
              <option value="RTGS">RTGS (High Value)</option>
              <option value="NEFT">NEFT (Standard)</option>
              <option value="IMPS">IMPS (Immediate)</option>
              <option value="Cheque">Cheque</option>
              <option value="DD">Demand Draft</option>
            </select>
          </div>

          <div className="col-sm-4 col-md-3">
            <select
              className="form-select form-select-sm"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              aria-label="Filter by Status"
            >
              <option value="">All Statuses</option>
              <option value="Completed">Completed</option>
              <option value="Processing">Processing</option>
              <option value="Initiated">Initiated</option>
              <option value="Failed">Failed</option>
              <option value="Reversed">Reversed</option>
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

      {/* Main Table Card */}
      <div className="card border-0 shadow-sm rounded-3 bg-white overflow-hidden">
        {loading ? (
          <div className="py-5">
            <LoadingSpinner text="Loading payment ledger..." />
          </div>
        ) : payments.length === 0 ? (
          <EmptyState
            icon="bi-cash-stack"
            title="No payment records found"
            message={
              search || statusFilter || methodFilter
                ? 'Try adjusting your search criteria or filters.'
                : 'No defence disbursements have been recorded yet.'
            }
            actionText={canWrite() ? 'Record Payment' : null}
            onAction={canWrite() ? () => window.location.assign('/app/finance/payments/new') : null}
          />
        ) : (
          <div className="table-responsive">
            <table className="table table-hover align-middle mb-0">
              <thead className="table-light">
                <tr className="text-secondary small">
                  <th>Payment Ref #</th>
                  <th>Associated Invoice</th>
                  <th>Settlement Date</th>
                  <th>Method</th>
                  <th>Status</th>
                  <th className="text-end">Disbursed (₹)</th>
                  <th>Processed By</th>
                  <th>Remarks / UTR</th>
                </tr>
              </thead>
              <tbody>
                {payments.map(p => (
                  <tr key={p.id}>
                    <td>
                      <span className="fw-bold font-monospace text-primary">{p.payment_reference}</span>
                    </td>
                    <td>
                      <Link
                        to={`/app/finance/invoices/${p.invoice}`}
                        className="fw-semibold text-decoration-none"
                      >
                        {p.invoice_number || `Invoice #${p.invoice}`}
                      </Link>
                    </td>
                    <td className="small text-muted">{formatDate(p.payment_date)}</td>
                    <td>
                      <span className="badge bg-light text-dark border">{p.payment_method}</span>
                    </td>
                    <td>
                      <StatusBadge status={p.status} />
                    </td>
                    <td className="text-end fw-bold text-success">{formatINR(p.amount)}</td>
                    <td className="small text-muted">{p.processed_by_name || 'Treasury Officer'}</td>
                    <td className="small text-muted text-truncate" style={{ maxWidth: '200px' }} title={p.remarks}>
                      {p.remarks || '—'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Pagination Footer */}
        {!loading && payments.length > 0 && (
          <div className="card-footer bg-white border-top d-flex justify-content-between align-items-center py-3">
            <span className="text-muted small">
              Showing {payments.length} of {pagination.count} records
            </span>
            <div className="btn-group btn-group-sm">
              <button
                className="btn btn-outline-secondary"
                disabled={!pagination.previous || pagination.page <= 1}
                onClick={() => fetchPayments(pagination.page - 1)}
              >
                Previous
              </button>
              <button className="btn btn-outline-secondary active" disabled>
                Page {pagination.page}
              </button>
              <button
                className="btn btn-outline-secondary"
                disabled={!pagination.next}
                onClick={() => fetchPayments(pagination.page + 1)}
              >
                Next
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
