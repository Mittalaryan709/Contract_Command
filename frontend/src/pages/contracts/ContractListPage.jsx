import { useState, useEffect, useCallback, useMemo } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext.jsx'
import { getContracts, deleteContract } from '../../api/contractApi.js'
import { getVendors } from '../../api/vendorApi.js'
import useDebounce from '../../hooks/useDebounce.js'
import StatusBadge from '../../components/common/StatusBadge.jsx'
import LoadingSpinner from '../../components/common/LoadingSpinner.jsx'
import EmptyState from '../../components/common/EmptyState.jsx'
import ConfirmDialog from '../../components/common/ConfirmDialog.jsx'
import { formatINR, formatDate } from '../../utils/formatters.js'

export default function ContractListPage() {
  const { canWrite, canDelete } = useAuth()
  const navigate = useNavigate()

  // State
  const [contracts, setContracts] = useState([])
  const [vendors, setVendors] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [pagination, setPagination] = useState({ count: 0, next: null, previous: null, page: 1, pageSize: 10 })

  // Search & Filters
  const [search, setSearch] = useState('')
  const debouncedSearch = useDebounce(search, 400)
  const [statusFilter, setStatusFilter] = useState('')
  const [typeFilter, setTypeFilter] = useState('')
  const [vendorFilter, setVendorFilter] = useState('')

  // Delete modal state
  const [deleteTarget, setDeleteTarget] = useState(null)
  const [deleteLoading, setDeleteLoading] = useState(false)
  const [feedbackMsg, setFeedbackMsg] = useState('')

  // Fetch vendors once for filter dropdown
  useEffect(() => {
    getVendors({ page_size: 100 })
      .then(res => {
        const vendorList = res.data?.data?.results || res.data?.results || res.data?.data || []
        setVendors(vendorList)
      })
      .catch(() => {})
  }, [])

  // Fetch contracts
  const fetchContracts = useCallback(async (page = 1) => {
    setLoading(true)
    setError('')
    try {
      const params = {
        page,
        search: debouncedSearch.trim() || undefined,
        status: statusFilter || undefined,
        contract_type: typeFilter || undefined,
        vendor: vendorFilter || undefined,
      }
      const res = await getContracts(params)
      const data = res.data?.data ?? res.data
      const results = data.results || (Array.isArray(data) ? data : [])
      setContracts(results)
      setPagination({
        count: data.count || results.length,
        next: data.next,
        previous: data.previous,
        page,
        pageSize: 10,
      })
    } catch (err) {
      setError(err.response?.data?.message || 'Unable to load contract repository. Please verify connectivity.')
    } finally {
      setLoading(false)
    }
  }, [debouncedSearch, statusFilter, typeFilter, vendorFilter])

  useEffect(() => {
    fetchContracts(1)
  }, [fetchContracts])

  // Summary Metrics calculations
  const stats = useMemo(() => {
    const total = pagination.count
    const active = contracts.filter(c => c.status === 'Active').length
    const totalVal = contracts.reduce((acc, c) => acc + (parseFloat(c.value) || 0), 0)
    const draft = contracts.filter(c => c.status === 'Draft').length
    return { total, active, totalVal, draft }
  }, [contracts, pagination.count])

  // Handle Delete
  const handleDeleteConfirm = async () => {
    if (!deleteTarget) return
    setDeleteLoading(true)
    try {
      await deleteContract(deleteTarget.id)
      setFeedbackMsg(`Contract ${deleteTarget.contract_number} was successfully deleted.`)
      setDeleteTarget(null)
      fetchContracts(pagination.page)
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to delete contract. Administrative clearance required.')
    } finally {
      setDeleteLoading(false)
    }
  }

  const handleClearFilters = () => {
    setSearch('')
    setStatusFilter('')
    setTypeFilter('')
    setVendorFilter('')
  }

  return (
    <div className="container-fluid p-0">
      {/* Header Bar */}
      <div className="d-flex flex-column flex-sm-row justify-content-between align-items-sm-center gap-3 mb-4 pb-2 border-bottom">
        <div>
          <div className="d-flex align-items-center gap-2 mb-1">
            <h4 className="fw-bold mb-0" style={{ color: '#102A43' }}>Defence Contract Repository</h4>
            <span className="badge bg-secondary" style={{ fontSize: '0.7rem' }}>MODULE 1</span>
          </div>
          <p className="text-muted small mb-0">
            Centralized registry of procurement contracts, strategic supply agreements, and audit documentation.
          </p>
        </div>

        {canWrite() && (
          <Link to="/app/contracts/new" className="btn btn-navy d-flex align-items-center gap-2 shadow-sm">
            <i className="bi bi-file-earmark-plus-fill text-warning"></i>
            <span>Register New Contract</span>
          </Link>
        )}
      </div>

      {/* Metrics Banner */}
      <div className="row g-3 mb-4">
        <div className="col-sm-6 col-lg-3">
          <div className="card border-0 shadow-sm p-3 rounded-3 bg-white h-100 border-start border-4 border-primary">
            <div className="text-muted small fw-semibold text-uppercase">Total Registered</div>
            <div className="h3 fw-bold my-1 text-dark">{stats.total}</div>
            <div className="text-muted" style={{ fontSize: '0.75rem' }}>Contracts in ledger</div>
          </div>
        </div>
        <div className="col-sm-6 col-lg-3">
          <div className="card border-0 shadow-sm p-3 rounded-3 bg-white h-100 border-start border-4 border-success">
            <div className="text-muted small fw-semibold text-uppercase">Active Agreements</div>
            <div className="h3 fw-bold my-1 text-success">{stats.active}</div>
            <div className="text-muted" style={{ fontSize: '0.75rem' }}>Operational execution</div>
          </div>
        </div>
        <div className="col-sm-6 col-lg-3">
          <div className="card border-0 shadow-sm p-3 rounded-3 bg-white h-100 border-start border-4 border-warning">
            <div className="text-muted small fw-semibold text-uppercase">Contract Value (Page)</div>
            <div className="h4 fw-bold my-1 text-dark">{formatINR(stats.totalVal)}</div>
            <div className="text-muted" style={{ fontSize: '0.75rem' }}>Visible committed funds</div>
          </div>
        </div>
        <div className="col-sm-6 col-lg-3">
          <div className="card border-0 shadow-sm p-3 rounded-3 bg-white h-100 border-start border-4 border-secondary">
            <div className="text-muted small fw-semibold text-uppercase">Draft / In Review</div>
            <div className="h3 fw-bold my-1 text-secondary">{stats.draft}</div>
            <div className="text-muted" style={{ fontSize: '0.75rem' }}>Pending sign-off</div>
          </div>
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

      {/* Error Alert */}
      {error && (
        <div className="alert alert-danger d-flex align-items-center gap-2 small mb-4" role="alert">
          <i className="bi bi-exclamation-octagon-fill text-danger flex-shrink-0"></i>
          <span className="flex-grow-1">{error}</span>
          <button type="button" className="btn btn-sm btn-outline-danger" onClick={() => fetchContracts(pagination.page)}>Retry</button>
        </div>
      )}

      {/* Filter and Search Bar */}
      <div className="card border-0 shadow-sm p-3 mb-4 rounded-3 bg-white">
        <div className="row g-2 align-items-center">
          {/* Search Input */}
          <div className="col-md-4">
            <div className="input-group input-group-sm">
              <span className="input-group-text bg-light border-end-0">
                <i className="bi bi-search text-muted"></i>
              </span>
              <input
                type="text"
                className="form-control border-start-0"
                placeholder="Search by contract #, title, or vendor..."
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

          {/* Status Filter */}
          <div className="col-sm-4 col-md-2">
            <select
              className="form-select form-select-sm"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              aria-label="Filter by Status"
            >
              <option value="">All Statuses</option>
              <option value="Draft">Draft</option>
              <option value="Active">Active</option>
              <option value="Expired">Expired</option>
              <option value="Terminated">Terminated</option>
              <option value="Completed">Completed</option>
            </select>
          </div>

          {/* Type Filter */}
          <div className="col-sm-4 col-md-2">
            <select
              className="form-select form-select-sm"
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value)}
              aria-label="Filter by Type"
            >
              <option value="">All Types</option>
              <option value="Supply">Supply</option>
              <option value="Service">Service</option>
              <option value="Maintenance">Maintenance</option>
              <option value="Research">Research</option>
              <option value="Consulting">Consulting</option>
            </select>
          </div>

          {/* Vendor Filter */}
          <div className="col-sm-4 col-md-3">
            <select
              className="form-select form-select-sm"
              value={vendorFilter}
              onChange={(e) => setVendorFilter(e.target.value)}
              aria-label="Filter by Vendor"
            >
              <option value="">All Contractors / Vendors</option>
              {vendors.map(v => (
                <option key={v.id} value={v.id}>{v.company_name}</option>
              ))}
            </select>
          </div>

          {/* Clear Filters */}
          <div className="col-auto">
            <button
              type="button"
              className="btn btn-sm btn-outline-secondary d-flex align-items-center gap-1"
              onClick={handleClearFilters}
              title="Reset all search parameters"
            >
              <i className="bi bi-arrow-counterclockwise"></i>
              <span>Reset</span>
            </button>
          </div>
        </div>
      </div>

      {/* Contracts Table */}
      <div className="card border-0 shadow-sm rounded-3 bg-white overflow-hidden">
        {loading ? (
          <div className="p-5 text-center">
            <LoadingSpinner message="Querying Defence Contract Ledger..." />
          </div>
        ) : contracts.length === 0 ? (
          <div className="p-5">
            <EmptyState
              title="No Contracts Located"
              message={search || statusFilter || typeFilter || vendorFilter
                ? 'No contracts matched your current filter criteria. Try adjusting or clearing search terms.'
                : 'The contract repository does not currently contain any records.'}
              actionText={canWrite() ? 'Create Initial Contract' : null}
              onAction={canWrite() ? () => navigate('/app/contracts/new') : null}
            />
          </div>
        ) : (
          <>
            <div className="table-responsive">
              <table className="table table-hover align-middle mb-0" style={{ fontSize: '0.86rem' }}>
                <thead className="table-light text-uppercase text-muted" style={{ fontSize: '0.72rem', letterSpacing: '0.5px' }}>
                  <tr>
                    <th scope="col" className="ps-3">Contract #</th>
                    <th scope="col">Title &amp; Scope</th>
                    <th scope="col">Vendor / Supplier</th>
                    <th scope="col">Type</th>
                    <th scope="col" className="text-end">Value (INR)</th>
                    <th scope="col">Validity Period</th>
                    <th scope="col">Status</th>
                    <th scope="col" className="text-end pe-3">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {contracts.map(contract => (
                    <tr key={contract.id}>
                      {/* Contract # */}
                      <td className="ps-3 fw-semibold">
                        <Link
                          to={`/app/contracts/${contract.id}`}
                          className="font-monospace text-decoration-none text-primary"
                        >
                          {contract.contract_number}
                        </Link>
                      </td>

                      {/* Title & Scope */}
                      <td>
                        <div className="fw-semibold text-dark text-truncate" style={{ maxWidth: '260px' }}>
                          <Link to={`/app/contracts/${contract.id}`} className="text-dark text-decoration-none">
                            {contract.title}
                          </Link>
                        </div>
                        {contract.description && (
                          <div className="text-muted text-truncate" style={{ maxWidth: '260px', fontSize: '0.75rem' }}>
                            {contract.description}
                          </div>
                        )}
                      </td>

                      {/* Vendor */}
                      <td>
                        <div className="text-dark fw-medium text-truncate" style={{ maxWidth: '200px' }}>
                          {contract.vendor_name || '—'}
                        </div>
                      </td>

                      {/* Type */}
                      <td>
                        <span className="badge bg-light text-dark border">
                          {contract.contract_type}
                        </span>
                      </td>

                      {/* Value */}
                      <td className="text-end font-monospace fw-semibold text-dark">
                        {formatINR(contract.value)}
                      </td>

                      {/* Validity Period */}
                      <td>
                        <div className="text-dark" style={{ fontSize: '0.78rem' }}>
                          {formatDate(contract.start_date)}
                        </div>
                        <div className="text-muted" style={{ fontSize: '0.72rem' }}>
                          to {formatDate(contract.end_date)}
                        </div>
                      </td>

                      {/* Status */}
                      <td>
                        <StatusBadge status={contract.status} />
                      </td>

                      {/* Actions */}
                      <td className="text-end pe-3">
                        <div className="d-inline-flex align-items-center gap-1">
                          <Link
                            to={`/app/contracts/${contract.id}`}
                            className="btn btn-sm btn-outline-secondary p-1 px-2"
                            title="View contract details and documents"
                          >
                            <i className="bi bi-eye"></i>
                          </Link>

                          {canWrite() && (
                            <Link
                              to={`/app/contracts/${contract.id}/edit`}
                              className="btn btn-sm btn-outline-primary p-1 px-2"
                              title="Edit contract terms"
                            >
                              <i className="bi bi-pencil"></i>
                            </Link>
                          )}

                          {canDelete() && (
                            <button
                              type="button"
                              className="btn btn-sm btn-outline-danger p-1 px-2"
                              title="Delete contract (Administrator only)"
                              onClick={() => setDeleteTarget(contract)}
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
                Showing {contracts.length} of {pagination.count} registered contracts
              </span>

              <div className="d-flex align-items-center gap-2">
                <button
                  type="button"
                  className="btn btn-sm btn-outline-secondary px-3"
                  disabled={!pagination.previous || loading}
                  onClick={() => fetchContracts(pagination.page - 1)}
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
                  onClick={() => fetchContracts(pagination.page + 1)}
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
        title="Authorize Contract Termination / Deletion"
        message={
          deleteTarget
            ? `Are you certain you wish to permanently delete contract ${deleteTarget.contract_number} ("${deleteTarget.title}")? This action requires Administrator clearance and cannot be reversed.`
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
