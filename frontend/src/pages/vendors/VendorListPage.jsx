import { useState, useEffect, useCallback, useMemo } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext.jsx'
import { getVendors, deleteVendor } from '../../api/vendorApi.js'
import useDebounce from '../../hooks/useDebounce.js'
import StatusBadge from '../../components/common/StatusBadge.jsx'
import LoadingSpinner from '../../components/common/LoadingSpinner.jsx'
import EmptyState from '../../components/common/EmptyState.jsx'
import ConfirmDialog from '../../components/common/ConfirmDialog.jsx'

export default function VendorListPage() {
  const { canWrite, canDelete } = useAuth()
  const navigate = useNavigate()

  const [vendors, setVendors] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [pagination, setPagination] = useState({ count: 0, next: null, previous: null, page: 1 })

  // Search & Filters
  const [search, setSearch] = useState('')
  const debouncedSearch = useDebounce(search, 400)
  const [statusFilter, setStatusFilter] = useState('')
  const [categoryFilter, setCategoryFilter] = useState('')

  // Delete modal
  const [deleteTarget, setDeleteTarget] = useState(null)
  const [deleteLoading, setDeleteLoading] = useState(false)
  const [feedbackMsg, setFeedbackMsg] = useState('')

  const fetchVendors = useCallback(async (page = 1) => {
    setLoading(true)
    setError('')
    try {
      const params = {
        page,
        search: debouncedSearch.trim() || undefined,
        status: statusFilter || undefined,
        category: categoryFilter || undefined,
      }
      const res = await getVendors(params)
      const data = res.data?.data ?? res.data
      const results = data.results || (Array.isArray(data) ? data : [])
      setVendors(results)
      setPagination({
        count: data.count || results.length,
        next: data.next,
        previous: data.previous,
        page,
      })
    } catch (err) {
      setError(err.response?.data?.message || 'Unable to load defence supplier directory.')
    } finally {
      setLoading(false)
    }
  }, [debouncedSearch, statusFilter, categoryFilter])

  useEffect(() => {
    fetchVendors(1)
  }, [fetchVendors])

  // Summary Metrics
  const stats = useMemo(() => {
    const total = pagination.count
    const active = vendors.filter(v => v.status === 'Active').length
    const blacklisted = vendors.filter(v => v.status === 'Blacklisted').length
    const evaluated = vendors.filter(v => v.average_score !== null && v.average_score !== undefined)
    const avgScore = evaluated.length > 0
      ? (evaluated.reduce((acc, v) => acc + parseFloat(v.average_score), 0) / evaluated.length).toFixed(1)
      : '—'
    return { total, active, blacklisted, avgScore }
  }, [vendors, pagination.count])

  const handleDeleteConfirm = async () => {
    if (!deleteTarget) return
    setDeleteLoading(true)
    try {
      await deleteVendor(deleteTarget.id)
      setFeedbackMsg(`Supplier ${deleteTarget.company_name} was removed from the registry.`)
      setDeleteTarget(null)
      fetchVendors(pagination.page)
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to delete vendor. Administrative clearance required.')
    } finally {
      setDeleteLoading(false)
    }
  }

  const handleClearFilters = () => {
    setSearch('')
    setStatusFilter('')
    setCategoryFilter('')
  }

  return (
    <div className="container-fluid p-0">
      {/* Header */}
      <div className="d-flex flex-column flex-sm-row justify-content-between align-items-sm-center gap-3 mb-4 pb-2 border-bottom">
        <div>
          <div className="d-flex align-items-center gap-2 mb-1">
            <h4 className="fw-bold mb-0" style={{ color: '#102A43' }}>Defence Supplier Directory</h4>
            <span className="badge bg-secondary" style={{ fontSize: '0.7rem' }}>MODULE 3</span>
          </div>
          <p className="text-muted small mb-0">
            Registered defence PSUs, private aerospace manufacturers, and 4-pillar evaluated suppliers.
          </p>
        </div>

        {canWrite() && (
          <Link to="/app/vendors/new" className="btn btn-navy d-flex align-items-center gap-2 shadow-sm">
            <i className="bi bi-building-add text-warning"></i>
            <span>Register New Vendor</span>
          </Link>
        )}
      </div>

      {/* Metrics Banner */}
      <div className="row g-3 mb-4">
        <div className="col-sm-6 col-lg-3">
          <div className="card border-0 shadow-sm p-3 rounded-3 bg-white h-100 border-start border-4 border-primary">
            <div className="text-muted small fw-semibold text-uppercase">Total Suppliers</div>
            <div className="h3 fw-bold my-1 text-dark">{stats.total}</div>
            <div className="text-muted" style={{ fontSize: '0.75rem' }}>Defence industry partners</div>
          </div>
        </div>
        <div className="col-sm-6 col-lg-3">
          <div className="card border-0 shadow-sm p-3 rounded-3 bg-white h-100 border-start border-4 border-success">
            <div className="text-muted small fw-semibold text-uppercase">Active / Approved</div>
            <div className="h3 fw-bold my-1 text-success">{stats.active}</div>
            <div className="text-muted" style={{ fontSize: '0.75rem' }}>Cleared for procurement</div>
          </div>
        </div>
        <div className="col-sm-6 col-lg-3">
          <div className="card border-0 shadow-sm p-3 rounded-3 bg-white h-100 border-start border-4 border-warning">
            <div className="text-muted small fw-semibold text-uppercase">Avg 4-Pillar Score</div>
            <div className="h3 fw-bold my-1 text-dark">
              {stats.avgScore !== '—' ? `${stats.avgScore}/10` : '—'}
            </div>
            <div className="text-muted" style={{ fontSize: '0.75rem' }}>Quality &bull; Delivery &bull; Price &bull; Compliance</div>
          </div>
        </div>
        <div className="col-sm-6 col-lg-3">
          <div className="card border-0 shadow-sm p-3 rounded-3 bg-white h-100 border-start border-4 border-danger">
            <div className="text-muted small fw-semibold text-uppercase">Blacklisted / Inactive</div>
            <div className="h3 fw-bold my-1 text-danger">{stats.blacklisted}</div>
            <div className="text-muted" style={{ fontSize: '0.75rem' }}>Restricted from tendering</div>
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
          <button type="button" className="btn btn-sm btn-outline-danger" onClick={() => fetchVendors(pagination.page)}>Retry</button>
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
                placeholder="Search vendor name, code, contact, or GSTIN..."
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
              <option value="Active">Active</option>
              <option value="Pending">Pending</option>
              <option value="Inactive">Inactive</option>
              <option value="Blacklisted">Blacklisted</option>
            </select>
          </div>

          <div className="col-sm-4 col-md-3">
            <select
              className="form-select form-select-sm"
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              aria-label="Filter by Category"
            >
              <option value="">All Defence Categories</option>
              <option value="Electronics">Electronics</option>
              <option value="Mechanical">Mechanical</option>
              <option value="IT Services">IT Services</option>
              <option value="Logistics">Logistics</option>
              <option value="Chemicals">Chemicals</option>
              <option value="Construction">Construction</option>
              <option value="Consulting">Consulting</option>
              <option value="Ammunition">Ammunition</option>
              <option value="Vehicles">Vehicles</option>
              <option value="Other">Other</option>
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

      {/* Vendors Table */}
      <div className="card border-0 shadow-sm rounded-3 bg-white overflow-hidden">
        {loading ? (
          <div className="p-5 text-center">
            <LoadingSpinner message="Querying Defence Supplier Registry..." />
          </div>
        ) : vendors.length === 0 ? (
          <div className="p-5">
            <EmptyState
              title="No Suppliers Located"
              message={search || statusFilter || categoryFilter
                ? 'No suppliers match your active search or filter parameters. Try clearing your filters.'
                : 'No suppliers registered in the directory yet.'}
              actionText={canWrite() ? 'Register Initial Vendor' : null}
              onAction={canWrite() ? () => navigate('/app/vendors/new') : null}
            />
          </div>
        ) : (
          <>
            <div className="table-responsive">
              <table className="table table-hover align-middle mb-0" style={{ fontSize: '0.86rem' }}>
                <thead className="table-light text-uppercase text-muted" style={{ fontSize: '0.72rem', letterSpacing: '0.5px' }}>
                  <tr>
                    <th scope="col" className="ps-3">Vendor Code</th>
                    <th scope="col">Enterprise &bull; Contact</th>
                    <th scope="col">Category</th>
                    <th scope="col">Location</th>
                    <th scope="col" className="text-center">Contracts</th>
                    <th scope="col" className="text-center">4-Pillar Score</th>
                    <th scope="col">Status</th>
                    <th scope="col" className="text-end pe-3">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {vendors.map(v => (
                    <tr key={v.id}>
                      {/* Vendor Code */}
                      <td className="ps-3 fw-semibold">
                        <Link
                          to={`/app/vendors/${v.id}`}
                          className="font-monospace text-decoration-none text-primary"
                        >
                          {v.vendor_code}
                        </Link>
                      </td>

                      {/* Company Name & Contact */}
                      <td>
                        <div className="fw-semibold text-dark text-truncate" style={{ maxWidth: '240px' }}>
                          <Link to={`/app/vendors/${v.id}`} className="text-dark text-decoration-none">
                            {v.company_name}
                          </Link>
                        </div>
                        <div className="text-muted small text-truncate" style={{ maxWidth: '240px', fontSize: '0.75rem' }}>
                          {v.contact_person} &bull; {v.email}
                        </div>
                      </td>

                      {/* Category */}
                      <td>
                        <span className="badge bg-light text-dark border">
                          {v.category}
                        </span>
                      </td>

                      {/* Location */}
                      <td>
                        <div className="text-dark small">{v.city || '—'}</div>
                        <div className="text-muted" style={{ fontSize: '0.72rem' }}>{v.state || 'India'}</div>
                      </td>

                      {/* Contracts Count */}
                      <td className="text-center">
                        <span className="badge bg-secondary rounded-pill">
                          {v.contracts_count || 0}
                        </span>
                      </td>

                      {/* 4-Pillar Score */}
                      <td className="text-center">
                        {v.average_score !== null && v.average_score !== undefined ? (
                          <span
                            className={`badge ${parseFloat(v.average_score) >= 8.0 ? 'bg-success' : parseFloat(v.average_score) >= 5.0 ? 'bg-warning text-dark' : 'bg-danger'}`}
                            style={{ fontSize: '0.75rem' }}
                          >
                            <i className="bi bi-star-fill me-1" style={{ fontSize: '0.65rem' }}></i>
                            {v.average_score}/10
                          </span>
                        ) : (
                          <span className="text-muted small">Not Scored</span>
                        )}
                      </td>

                      {/* Status */}
                      <td>
                        <StatusBadge status={v.status} />
                      </td>

                      {/* Actions */}
                      <td className="text-end pe-3">
                        <div className="d-inline-flex align-items-center gap-1">
                          <Link
                            to={`/app/vendors/${v.id}`}
                            className="btn btn-sm btn-outline-secondary p-1 px-2"
                            title="View vendor dossier"
                          >
                            <i className="bi bi-eye"></i>
                          </Link>

                          <Link
                            to={`/app/vendors/${v.id}/evaluate`}
                            className="btn btn-sm btn-outline-warning text-dark p-1 px-2"
                            title="Perform 4-pillar scorecard evaluation"
                          >
                            <i className="bi bi-award"></i>
                          </Link>

                          {canWrite() && (
                            <Link
                              to={`/app/vendors/${v.id}/edit`}
                              className="btn btn-sm btn-outline-primary p-1 px-2"
                              title="Edit vendor profile"
                            >
                              <i className="bi bi-pencil"></i>
                            </Link>
                          )}

                          {canDelete() && (
                            <button
                              type="button"
                              className="btn btn-sm btn-outline-danger p-1 px-2"
                              title="Delete vendor (Admin clearance)"
                              onClick={() => setDeleteTarget(v)}
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
                Showing {vendors.length} of {pagination.count} defence suppliers
              </span>

              <div className="d-flex align-items-center gap-2">
                <button
                  type="button"
                  className="btn btn-sm btn-outline-secondary px-3"
                  disabled={!pagination.previous || loading}
                  onClick={() => fetchVendors(pagination.page - 1)}
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
                  onClick={() => fetchVendors(pagination.page + 1)}
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
        title="Remove Supplier from Registry"
        message={
          deleteTarget
            ? `Are you certain you wish to delete supplier ${deleteTarget.company_name} (${deleteTarget.vendor_code})? Any historic evaluation records and contract associations may be affected.`
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
