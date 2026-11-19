import { useState, useEffect, useCallback, useMemo } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext.jsx'
import { getRequisitions, getPlans, approveRequisition, rejectRequisition } from '../../api/procurementApi.js'
import useDebounce from '../../hooks/useDebounce.js'
import StatusBadge from '../../components/common/StatusBadge.jsx'
import PriorityBadge from '../../components/common/PriorityBadge.jsx'
import LoadingSpinner from '../../components/common/LoadingSpinner.jsx'
import EmptyState from '../../components/common/EmptyState.jsx'
import { formatINR, formatDate } from '../../utils/formatters.js'

export default function RequisitionListPage() {
  const { canWrite } = useAuth()

  const [requisitions, setRequisitions] = useState([])
  const [plans, setPlans] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [pagination, setPagination] = useState({ count: 0, next: null, previous: null, page: 1 })

  // Filters
  const [search, setSearch] = useState('')
  const debouncedSearch = useDebounce(search, 400)
  const [statusFilter, setStatusFilter] = useState('')
  const [priorityFilter, setPriorityFilter] = useState('')
  const [planFilter, setPlanFilter] = useState('')

  // Action status
  const [actionLoading, setActionLoading] = useState(null)
  const [feedbackMsg, setFeedbackMsg] = useState('')

  // Load plans for filter
  useEffect(() => {
    getPlans({ page_size: 100 })
      .then(res => {
        const list = res.data?.data?.results || res.data?.results || res.data?.data || []
        setPlans(list)
      })
      .catch(() => {})
  }, [])

  const fetchRequisitions = useCallback(async (page = 1) => {
    setLoading(true)
    setError('')
    try {
      const params = {
        page,
        search: debouncedSearch.trim() || undefined,
        status: statusFilter || undefined,
        priority: priorityFilter || undefined,
        plan: planFilter || undefined,
      }
      const res = await getRequisitions(params)
      const data = res.data?.data ?? res.data
      const results = data.results || (Array.isArray(data) ? data : [])
      setRequisitions(results)
      setPagination({
        count: data.count || results.length,
        next: data.next,
        previous: data.previous,
        page,
      })
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to retrieve requisition indentures.')
    } finally {
      setLoading(false)
    }
  }, [debouncedSearch, statusFilter, priorityFilter, planFilter])

  useEffect(() => {
    fetchRequisitions(1)
  }, [fetchRequisitions])

  // Summary Metrics
  const stats = useMemo(() => {
    const total = pagination.count
    const pending = requisitions.filter(r => r.status === 'Pending').length
    const approved = requisitions.filter(r => r.status === 'Approved').length
    const totalVal = requisitions.reduce((acc, r) => acc + (parseFloat(r.total_amount) || 0), 0)
    return { total, pending, approved, totalVal }
  }, [requisitions, pagination.count])

  // Quick Approval / Rejection
  const handleApprove = async (id, num) => {
    setActionLoading(id)
    setFeedbackMsg('')
    try {
      await approveRequisition(id)
      setFeedbackMsg(`Requisition ${num} was successfully approved.`)
      fetchRequisitions(pagination.page)
    } catch (err) {
      setError(err.response?.data?.message || `Failed to approve requisition ${num}.`)
    } finally {
      setActionLoading(null)
    }
  }

  const handleReject = async (id, num) => {
    setActionLoading(id)
    setFeedbackMsg('')
    try {
      await rejectRequisition(id)
      setFeedbackMsg(`Requisition ${num} was rejected.`)
      fetchRequisitions(pagination.page)
    } catch (err) {
      setError(err.response?.data?.message || `Failed to reject requisition ${num}.`)
    } finally {
      setActionLoading(null)
    }
  }

  const handleClearFilters = () => {
    setSearch('')
    setStatusFilter('')
    setPriorityFilter('')
    setPlanFilter('')
  }

  return (
    <div className="container-fluid p-0">
      {/* Header */}
      <div className="d-flex flex-column flex-sm-row justify-content-between align-items-sm-center gap-3 mb-4 pb-2 border-bottom">
        <div>
          <div className="d-flex align-items-center gap-2 mb-1">
            <h4 className="fw-bold mb-0" style={{ color: '#102A43' }}>Defence Procurement Requisitions</h4>
            <span className="badge bg-secondary" style={{ fontSize: '0.7rem' }}>MODULE 2B</span>
          </div>
          <p className="text-muted small mb-0">
            Field indentures, equipment demand orders, and role-governed authorization workflows.
          </p>
        </div>

        <div className="d-flex gap-2">
          <Link to="/app/procurement/plans" className="btn btn-outline-secondary btn-sm d-flex align-items-center gap-1">
            <i className="bi bi-calendar3"></i>
            <span>Master Plans</span>
          </Link>
          <Link to="/app/procurement/requisitions/new" className="btn btn-navy btn-sm d-flex align-items-center gap-2 shadow-sm">
            <i className="bi bi-plus-circle-fill text-warning"></i>
            <span>Create Requisition</span>
          </Link>
        </div>
      </div>

      {/* Metrics Banner */}
      <div className="row g-3 mb-4">
        <div className="col-sm-6 col-lg-3">
          <div className="card border-0 shadow-sm p-3 rounded-3 bg-white h-100 border-start border-4 border-primary">
            <div className="text-muted small fw-semibold text-uppercase">Total Indentures</div>
            <div className="h3 fw-bold my-1 text-dark">{stats.total}</div>
            <div className="text-muted" style={{ fontSize: '0.75rem' }}>Demands recorded</div>
          </div>
        </div>
        <div className="col-sm-6 col-lg-3">
          <div className="card border-0 shadow-sm p-3 rounded-3 bg-white h-100 border-start border-4 border-warning">
            <div className="text-muted small fw-semibold text-uppercase">Pending Approval</div>
            <div className="h3 fw-bold my-1 text-warning">{stats.pending}</div>
            <div className="text-muted" style={{ fontSize: '0.75rem' }}>Awaiting clearance</div>
          </div>
        </div>
        <div className="col-sm-6 col-lg-3">
          <div className="card border-0 shadow-sm p-3 rounded-3 bg-white h-100 border-start border-4 border-success">
            <div className="text-muted small fw-semibold text-uppercase">Approved Requisitions</div>
            <div className="h3 fw-bold my-1 text-success">{stats.approved}</div>
            <div className="text-muted" style={{ fontSize: '0.75rem' }}>Ready for RFQ / PO</div>
          </div>
        </div>
        <div className="col-sm-6 col-lg-3">
          <div className="card border-0 shadow-sm p-3 rounded-3 bg-white h-100 border-start border-4 border-info">
            <div className="text-muted small fw-semibold text-uppercase">Valuation (Page)</div>
            <div className="h4 fw-bold my-1 text-dark">{formatINR(stats.totalVal)}</div>
            <div className="text-muted" style={{ fontSize: '0.75rem' }}>Visible estimated allocation</div>
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
          <button type="button" className="btn btn-sm btn-outline-danger" onClick={() => fetchRequisitions(pagination.page)}>Retry</button>
        </div>
      )}

      {/* Filter and Search Bar */}
      <div className="card border-0 shadow-sm p-3 mb-4 rounded-3 bg-white">
        <div className="row g-2 align-items-center">
          <div className="col-md-4">
            <div className="input-group input-group-sm">
              <span className="input-group-text bg-light border-end-0">
                <i className="bi bi-search text-muted"></i>
              </span>
              <input
                type="text"
                className="form-control border-start-0"
                placeholder="Search requisition #, title, or requester..."
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

          <div className="col-sm-4 col-md-2">
            <select
              className="form-select form-select-sm"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              aria-label="Filter by Status"
            >
              <option value="">All Statuses</option>
              <option value="Pending">Pending</option>
              <option value="Approved">Approved</option>
              <option value="Rejected">Rejected</option>
              <option value="Fulfilled">Fulfilled</option>
              <option value="Cancelled">Cancelled</option>
            </select>
          </div>

          <div className="col-sm-4 col-md-2">
            <select
              className="form-select form-select-sm"
              value={priorityFilter}
              onChange={(e) => setPriorityFilter(e.target.value)}
              aria-label="Filter by Priority"
            >
              <option value="">All Priorities</option>
              <option value="Urgent">Urgent</option>
              <option value="High">High</option>
              <option value="Medium">Medium</option>
              <option value="Low">Low</option>
            </select>
          </div>

          <div className="col-sm-4 col-md-3">
            <select
              className="form-select form-select-sm"
              value={planFilter}
              onChange={(e) => setPlanFilter(e.target.value)}
              aria-label="Filter by Procurement Plan"
            >
              <option value="">All Procurement Plans</option>
              {plans.map(p => (
                <option key={p.id} value={p.id}>{p.plan_number} &bull; {p.title}</option>
              ))}
            </select>
          </div>

          <div className="col-auto">
            <button
              type="button"
              className="btn btn-sm btn-outline-secondary d-flex align-items-center gap-1"
              onClick={handleClearFilters}
              title="Reset search parameters"
            >
              <i className="bi bi-arrow-counterclockwise"></i>
              <span>Reset</span>
            </button>
          </div>
        </div>
      </div>

      {/* Requisitions Table */}
      <div className="card border-0 shadow-sm rounded-3 bg-white overflow-hidden">
        {loading ? (
          <div className="p-5 text-center">
            <LoadingSpinner message="Querying Defence Requisition Ledger..." />
          </div>
        ) : requisitions.length === 0 ? (
          <div className="p-5">
            <EmptyState
              title="No Requisitions Located"
              message={search || statusFilter || priorityFilter || planFilter
                ? 'No requisitions match the filter parameters. Try clearing your filters.'
                : 'No procurement requisitions submitted yet.'}
              actionText="Submit First Requisition"
              onAction={() => {}}
            />
          </div>
        ) : (
          <>
            <div className="table-responsive">
              <table className="table table-hover align-middle mb-0" style={{ fontSize: '0.86rem' }}>
                <thead className="table-light text-uppercase text-muted" style={{ fontSize: '0.72rem', letterSpacing: '0.5px' }}>
                  <tr>
                    <th scope="col" className="ps-3">Requisition #</th>
                    <th scope="col">Title &amp; Program Plan</th>
                    <th scope="col">Priority</th>
                    <th scope="col" className="text-end">Estimated Value</th>
                    <th scope="col">Requester &amp; Due Date</th>
                    <th scope="col">Status</th>
                    <th scope="col" className="text-end pe-3">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {requisitions.map(req => (
                    <tr key={req.id}>
                      {/* Requisition # */}
                      <td className="ps-3 fw-semibold">
                        <Link
                          to={`/app/procurement/requisitions/${req.id}`}
                          className="font-monospace text-decoration-none text-primary"
                        >
                          {req.requisition_number}
                        </Link>
                      </td>

                      {/* Title & Plan */}
                      <td>
                        <div className="fw-semibold text-dark text-truncate" style={{ maxWidth: '260px' }}>
                          <Link to={`/app/procurement/requisitions/${req.id}`} className="text-dark text-decoration-none">
                            {req.title}
                          </Link>
                        </div>
                        <div className="text-muted text-truncate" style={{ maxWidth: '260px', fontSize: '0.75rem' }}>
                          Plan: {req.plan_title || `PP #${req.plan}`}
                        </div>
                      </td>

                      {/* Priority */}
                      <td>
                        <PriorityBadge priority={req.priority} />
                      </td>

                      {/* Total Amount */}
                      <td className="text-end font-monospace fw-semibold text-dark">
                        {formatINR(req.total_amount)}
                      </td>

                      {/* Requester & Date */}
                      <td>
                        <div className="text-dark" style={{ fontSize: '0.78rem' }}>
                          {req.requested_by_name || 'Staff Officer'}
                        </div>
                        <div className="text-muted" style={{ fontSize: '0.72rem' }}>
                          Due: {formatDate(req.required_by_date)}
                        </div>
                      </td>

                      {/* Status */}
                      <td>
                        <StatusBadge status={req.status} />
                      </td>

                      {/* Actions */}
                      <td className="text-end pe-3">
                        <div className="d-inline-flex align-items-center gap-1">
                          <Link
                            to={`/app/procurement/requisitions/${req.id}`}
                            className="btn btn-sm btn-outline-secondary p-1 px-2"
                            title="View requisition line items"
                          >
                            <i className="bi bi-eye"></i>
                          </Link>

                          {/* Quick Approve / Reject for Contracts Managers & Admins */}
                          {canWrite() && req.status === 'Pending' && (
                            <>
                              <button
                                type="button"
                                className="btn btn-sm btn-outline-success p-1 px-2"
                                title="Approve Requisition"
                                disabled={actionLoading === req.id}
                                onClick={() => handleApprove(req.id, req.requisition_number)}
                              >
                                {actionLoading === req.id ? (
                                  <span className="spinner-border spinner-border-sm"></span>
                                ) : (
                                  <i className="bi bi-check-lg"></i>
                                )}
                              </button>
                              <button
                                type="button"
                                className="btn btn-sm btn-outline-danger p-1 px-2"
                                title="Reject Requisition"
                                disabled={actionLoading === req.id}
                                onClick={() => handleReject(req.id, req.requisition_number)}
                              >
                                <i className="bi bi-x-lg"></i>
                              </button>
                            </>
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
                Showing {requisitions.length} of {pagination.count} requisitions
              </span>

              <div className="d-flex align-items-center gap-2">
                <button
                  type="button"
                  className="btn btn-sm btn-outline-secondary px-3"
                  disabled={!pagination.previous || loading}
                  onClick={() => fetchRequisitions(pagination.page - 1)}
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
                  onClick={() => fetchRequisitions(pagination.page + 1)}
                >
                  Next<i className="bi bi-chevron-right ms-1"></i>
                </button>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  )
}
