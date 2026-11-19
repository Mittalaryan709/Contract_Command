import { useState, useEffect, useCallback, useMemo } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext.jsx'
import { getPlans, deletePlan } from '../../api/procurementApi.js'
import useDebounce from '../../hooks/useDebounce.js'
import StatusBadge from '../../components/common/StatusBadge.jsx'
import LoadingSpinner from '../../components/common/LoadingSpinner.jsx'
import EmptyState from '../../components/common/EmptyState.jsx'
import ConfirmDialog from '../../components/common/ConfirmDialog.jsx'
import { formatINR, formatDate } from '../../utils/formatters.js'

export default function PlanListPage() {
  const { canWrite } = useAuth()
  const navigate = useNavigate()

  const [plans, setPlans] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [pagination, setPagination] = useState({ count: 0, next: null, previous: null, page: 1 })

  // Filters
  const [search, setSearch] = useState('')
  const debouncedSearch = useDebounce(search, 400)
  const [statusFilter, setStatusFilter] = useState('')
  const [fiscalYearFilter, setFiscalYearFilter] = useState('')

  // Delete modal
  const [deleteTarget, setDeleteTarget] = useState(null)
  const [deleteLoading, setDeleteLoading] = useState(false)
  const [feedbackMsg, setFeedbackMsg] = useState('')

  const fetchPlans = useCallback(async (page = 1) => {
    setLoading(true)
    setError('')
    try {
      const params = {
        page,
        search: debouncedSearch.trim() || undefined,
        status: statusFilter || undefined,
        fiscal_year: fiscalYearFilter || undefined,
      }
      const res = await getPlans(params)
      const data = res.data?.data ?? res.data
      const results = data.results || (Array.isArray(data) ? data : [])
      setPlans(results)
      setPagination({
        count: data.count || results.length,
        next: data.next,
        previous: data.previous,
        page,
      })
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to retrieve procurement plans.')
    } finally {
      setLoading(false)
    }
  }, [debouncedSearch, statusFilter, fiscalYearFilter])

  useEffect(() => {
    fetchPlans(1)
  }, [fetchPlans])

  // Summary Metrics
  const stats = useMemo(() => {
    const total = pagination.count
    const active = plans.filter(p => p.status === 'Active').length
    const totalBudget = plans.reduce((acc, p) => acc + (parseFloat(p.total_budget) || 0), 0)
    const totalReqs = plans.reduce((acc, p) => acc + (p.requisitions_count || 0), 0)
    return { total, active, totalBudget, totalReqs }
  }, [plans, pagination.count])

  const handleDeleteConfirm = async () => {
    if (!deleteTarget) return
    setDeleteLoading(true)
    try {
      await deletePlan(deleteTarget.id)
      setFeedbackMsg(`Procurement Plan ${deleteTarget.plan_number} successfully removed.`)
      setDeleteTarget(null)
      fetchPlans(pagination.page)
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to delete procurement plan.')
    } finally {
      setDeleteLoading(false)
    }
  }

  const handleClearFilters = () => {
    setSearch('')
    setStatusFilter('')
    setFiscalYearFilter('')
  }

  return (
    <div className="container-fluid p-0">
      {/* Header */}
      <div className="d-flex flex-column flex-sm-row justify-content-between align-items-sm-center gap-3 mb-4 pb-2 border-bottom">
        <div>
          <div className="d-flex align-items-center gap-2 mb-1">
            <h4 className="fw-bold mb-0" style={{ color: '#102A43' }}>Procurement Master Plans</h4>
            <span className="badge bg-secondary" style={{ fontSize: '0.7rem' }}>MODULE 2A</span>
          </div>
          <p className="text-muted small mb-0">
            Multi-year procurement planning, budget ceilings, and tactical allocation schedules.
          </p>
        </div>

        <div className="d-flex gap-2">
          <Link to="/app/procurement/requisitions" className="btn btn-outline-secondary btn-sm d-flex align-items-center gap-1">
            <i className="bi bi-clipboard-check"></i>
            <span>Requisitions Ledger</span>
          </Link>
          {canWrite() && (
            <Link to="/app/procurement/plans/new" className="btn btn-navy btn-sm d-flex align-items-center gap-2 shadow-sm">
              <i className="bi bi-calendar-plus text-warning"></i>
              <span>Create Procurement Plan</span>
            </Link>
          )}
        </div>
      </div>

      {/* Metrics Banner */}
      <div className="row g-3 mb-4">
        <div className="col-sm-6 col-lg-3">
          <div className="card border-0 shadow-sm p-3 rounded-3 bg-white h-100 border-start border-4 border-primary">
            <div className="text-muted small fw-semibold text-uppercase">Total Plans</div>
            <div className="h3 fw-bold my-1 text-dark">{stats.total}</div>
            <div className="text-muted" style={{ fontSize: '0.75rem' }}>Fiscal acquisition programs</div>
          </div>
        </div>
        <div className="col-sm-6 col-lg-3">
          <div className="card border-0 shadow-sm p-3 rounded-3 bg-white h-100 border-start border-4 border-success">
            <div className="text-muted small fw-semibold text-uppercase">Active Plans</div>
            <div className="h3 fw-bold my-1 text-success">{stats.active}</div>
            <div className="text-muted" style={{ fontSize: '0.75rem' }}>Currently open for requisitions</div>
          </div>
        </div>
        <div className="col-sm-6 col-lg-3">
          <div className="card border-0 shadow-sm p-3 rounded-3 bg-white h-100 border-start border-4 border-warning">
            <div className="text-muted small fw-semibold text-uppercase">Total Budget Ceiling</div>
            <div className="h4 fw-bold my-1 text-dark">{formatINR(stats.totalBudget)}</div>
            <div className="text-muted" style={{ fontSize: '0.75rem' }}>Visible planned funding</div>
          </div>
        </div>
        <div className="col-sm-6 col-lg-3">
          <div className="card border-0 shadow-sm p-3 rounded-3 bg-white h-100 border-start border-4 border-info">
            <div className="text-muted small fw-semibold text-uppercase">Linked Requisitions</div>
            <div className="h3 fw-bold my-1 text-info">{stats.totalReqs}</div>
            <div className="text-muted" style={{ fontSize: '0.75rem' }}>Demand orders generated</div>
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
          <button type="button" className="btn btn-sm btn-outline-danger" onClick={() => fetchPlans(pagination.page)}>Retry</button>
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
                placeholder="Search plan #, title, or description..."
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
              <option value="Approved">Approved</option>
              <option value="Active">Active</option>
              <option value="Closed">Closed</option>
            </select>
          </div>

          <div className="col-sm-4 col-md-3">
            <select
              className="form-select form-select-sm"
              value={fiscalYearFilter}
              onChange={(e) => setFiscalYearFilter(e.target.value)}
              aria-label="Filter by Fiscal Year"
            >
              <option value="">All Fiscal Years</option>
              <option value="2024-2025">FY 2024-2025</option>
              <option value="2025-2026">FY 2025-2026</option>
              <option value="2026-2027">FY 2026-2027</option>
              <option value="2027-2028">FY 2027-2028</option>
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

      {/* Plans Table */}
      <div className="card border-0 shadow-sm rounded-3 bg-white overflow-hidden">
        {loading ? (
          <div className="p-5 text-center">
            <LoadingSpinner message="Querying Procurement Master Plans..." />
          </div>
        ) : plans.length === 0 ? (
          <div className="p-5">
            <EmptyState
              title="No Procurement Plans Located"
              message={search || statusFilter || fiscalYearFilter
                ? 'No procurement plans match the filter parameters. Try clearing your filters.'
                : 'No procurement master plans recorded yet.'}
              actionText={canWrite() ? 'Create New Plan' : null}
              onAction={canWrite() ? () => navigate('/app/procurement/plans/new') : null}
            />
          </div>
        ) : (
          <>
            <div className="table-responsive">
              <table className="table table-hover align-middle mb-0" style={{ fontSize: '0.86rem' }}>
                <thead className="table-light text-uppercase text-muted" style={{ fontSize: '0.72rem', letterSpacing: '0.5px' }}>
                  <tr>
                    <th scope="col" className="ps-3">Plan #</th>
                    <th scope="col">Program Title &amp; Scope</th>
                    <th scope="col">Fiscal Year</th>
                    <th scope="col" className="text-end">Total Budget (INR)</th>
                    <th scope="col">Execution Window</th>
                    <th scope="col" className="text-center">Requisitions</th>
                    <th scope="col">Status</th>
                    <th scope="col" className="text-end pe-3">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {plans.map(plan => (
                    <tr key={plan.id}>
                      {/* Plan # */}
                      <td className="ps-3 fw-semibold">
                        <Link
                          to={`/app/procurement/plans/${plan.id}`}
                          className="font-monospace text-decoration-none text-primary"
                        >
                          {plan.plan_number}
                        </Link>
                      </td>

                      {/* Title & Scope */}
                      <td>
                        <div className="fw-semibold text-dark text-truncate" style={{ maxWidth: '280px' }}>
                          <Link to={`/app/procurement/plans/${plan.id}`} className="text-dark text-decoration-none">
                            {plan.title}
                          </Link>
                        </div>
                        {plan.description && (
                          <div className="text-muted text-truncate" style={{ maxWidth: '280px', fontSize: '0.75rem' }}>
                            {plan.description}
                          </div>
                        )}
                      </td>

                      {/* Fiscal Year */}
                      <td>
                        <span className="badge bg-light text-dark border font-monospace">
                          {plan.fiscal_year}
                        </span>
                      </td>

                      {/* Total Budget */}
                      <td className="text-end font-monospace fw-semibold text-dark">
                        {formatINR(plan.total_budget)}
                      </td>

                      {/* Dates */}
                      <td>
                        <div className="text-dark" style={{ fontSize: '0.78rem' }}>
                          {formatDate(plan.start_date)}
                        </div>
                        <div className="text-muted" style={{ fontSize: '0.72rem' }}>
                          to {formatDate(plan.end_date)}
                        </div>
                      </td>

                      {/* Requisitions count */}
                      <td className="text-center">
                        <span className="badge bg-secondary rounded-pill">
                          {plan.requisitions_count || 0}
                        </span>
                      </td>

                      {/* Status */}
                      <td>
                        <StatusBadge status={plan.status} />
                      </td>

                      {/* Actions */}
                      <td className="text-end pe-3">
                        <div className="d-inline-flex align-items-center gap-1">
                          <Link
                            to={`/app/procurement/plans/${plan.id}`}
                            className="btn btn-sm btn-outline-secondary p-1 px-2"
                            title="View plan details & requisitions"
                          >
                            <i className="bi bi-eye"></i>
                          </Link>

                          {canWrite() && (
                            <Link
                              to={`/app/procurement/plans/${plan.id}/edit`}
                              className="btn btn-sm btn-outline-primary p-1 px-2"
                              title="Edit procurement plan"
                            >
                              <i className="bi bi-pencil"></i>
                            </Link>
                          )}

                          {canWrite() && (
                            <button
                              type="button"
                              className="btn btn-sm btn-outline-danger p-1 px-2"
                              title="Delete plan"
                              onClick={() => setDeleteTarget(plan)}
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
                Showing {plans.length} of {pagination.count} procurement plans
              </span>

              <div className="d-flex align-items-center gap-2">
                <button
                  type="button"
                  className="btn btn-sm btn-outline-secondary px-3"
                  disabled={!pagination.previous || loading}
                  onClick={() => fetchPlans(pagination.page - 1)}
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
                  onClick={() => fetchPlans(pagination.page + 1)}
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
        title="Delete Procurement Plan"
        message={
          deleteTarget
            ? `Are you sure you want to delete procurement plan ${deleteTarget.plan_number} ("${deleteTarget.title}")? Linked requisitions may prevent deletion if protected.`
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
