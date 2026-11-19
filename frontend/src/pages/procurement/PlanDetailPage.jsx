import { useState, useEffect, useCallback } from 'react'
import { useParams, Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext.jsx'
import { getPlan, deletePlan, getRequisitions } from '../../api/procurementApi.js'
import StatusBadge from '../../components/common/StatusBadge.jsx'
import PriorityBadge from '../../components/common/PriorityBadge.jsx'
import LoadingSpinner from '../../components/common/LoadingSpinner.jsx'
import ConfirmDialog from '../../components/common/ConfirmDialog.jsx'
import { formatINR, formatDate, formatDateTime } from '../../utils/formatters.js'

export default function PlanDetailPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { canWrite } = useAuth()

  const [plan, setPlan] = useState(null)
  const [requisitions, setRequisitions] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  // Delete modal
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [deleteLoading, setDeleteLoading] = useState(false)

  const fetchData = useCallback(async () => {
    setLoading(true)
    setError('')
    try {
      const [planRes, reqsRes] = await Promise.all([
        getPlan(id),
        getRequisitions({ plan: id, page_size: 100 }),
      ])
      const planData = planRes.data?.data ?? planRes.data
      const reqsData = reqsRes.data?.data?.results || reqsRes.data?.results || reqsRes.data?.data || []

      setPlan(planData)
      setRequisitions(Array.isArray(reqsData) ? reqsData : [])
    } catch (err) {
      setError(err.response?.data?.message || 'Unable to retrieve procurement plan dossier.')
    } finally {
      setLoading(false)
    }
  }, [id])

  useEffect(() => {
    fetchData()
  }, [fetchData])

  const handleDeletePlan = async () => {
    setDeleteLoading(true)
    try {
      await deletePlan(id)
      navigate('/app/procurement/plans')
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to delete procurement plan.')
      setShowDeleteModal(false)
    } finally {
      setDeleteLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="p-5 text-center">
        <LoadingSpinner message="Retrieving Procurement Master Plan Dossier..." />
      </div>
    )
  }

  if (error && !plan) {
    return (
      <div className="container-fluid p-0">
        <div className="alert alert-danger d-flex align-items-center gap-3 p-4 rounded-3 shadow-sm">
          <i className="bi bi-exclamation-triangle-fill fs-3 text-danger"></i>
          <div>
            <h5 className="alert-heading fw-bold mb-1">Procurement Plan Unavailable</h5>
            <p className="mb-2 small">{error}</p>
            <Link to="/app/procurement/plans" className="btn btn-sm btn-outline-danger">
              <i className="bi bi-arrow-left me-1"></i>Return to Plans
            </Link>
          </div>
        </div>
      </div>
    )
  }

  const totalCommitted = requisitions.reduce((acc, r) => acc + (parseFloat(r.total_amount) || 0), 0)
  const budget = parseFloat(plan.total_budget) || 1
  const utilizationPct = Math.min(Math.round((totalCommitted / budget) * 100), 100)

  return (
    <div className="container-fluid p-0">
      {/* Header */}
      <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center gap-3 mb-4 pb-2 border-bottom">
        <div>
          <div className="d-flex align-items-center gap-2 mb-1 flex-wrap">
            <span className="font-monospace fw-bold px-2 py-1 bg-light border rounded text-primary" style={{ fontSize: '0.85rem' }}>
              {plan.plan_number}
            </span>
            <span className="badge bg-light text-dark border font-monospace">
              {plan.fiscal_year}
            </span>
            <StatusBadge status={plan.status} />
          </div>
          <h4 className="fw-bold mb-0 text-dark">{plan.title}</h4>
        </div>

        {/* Action Buttons */}
        <div className="d-flex align-items-center gap-2 flex-wrap">
          <Link to="/app/procurement/plans" className="btn btn-outline-secondary btn-sm">
            <i className="bi bi-arrow-left me-1"></i>Plans
          </Link>

          {canWrite() && (
            <Link to={`/app/procurement/plans/${plan.id}/edit`} className="btn btn-outline-primary btn-sm">
              <i className="bi bi-pencil me-1"></i>Edit Plan
            </Link>
          )}

          {canWrite() && (
            <button
              type="button"
              className="btn btn-outline-danger btn-sm"
              onClick={() => setShowDeleteModal(true)}
            >
              <i className="bi bi-trash me-1"></i>Delete
            </button>
          )}
        </div>
      </div>

      {/* Error Alert */}
      {error && (
        <div className="alert alert-danger alert-dismissible fade show d-flex align-items-center gap-2 small mb-4" role="alert">
          <i className="bi bi-exclamation-octagon-fill text-danger"></i>
          <span className="flex-grow-1">{error}</span>
          <button type="button" className="btn-close" onClick={() => setError('')}></button>
        </div>
      )}

      {/* Main Grid: Details + Budget Utilization */}
      <div className="row g-4 mb-4">
        {/* Left Col: Key Metrics and Scope */}
        <div className="col-lg-8">
          {/* Key Metrics Cards */}
          <div className="row g-3 mb-4">
            <div className="col-sm-4">
              <div className="card border-0 shadow-sm p-3 rounded-3 bg-white border-top border-4 border-warning h-100">
                <div className="text-muted small fw-semibold text-uppercase">Budget Ceiling</div>
                <div className="h4 fw-bold my-1 font-monospace text-dark">{formatINR(plan.total_budget)}</div>
                <div className="text-muted" style={{ fontSize: '0.72rem' }}>Sanctioned fiscal allocation</div>
              </div>
            </div>

            <div className="col-sm-4">
              <div className="card border-0 shadow-sm p-3 rounded-3 bg-white border-top border-4 border-primary h-100">
                <div className="text-muted small fw-semibold text-uppercase">Execution Timeline</div>
                <div className="fw-bold my-1 text-dark" style={{ fontSize: '0.9rem' }}>
                  {formatDate(plan.start_date)} &mdash; {formatDate(plan.end_date)}
                </div>
                <div className="text-muted" style={{ fontSize: '0.72rem' }}>Financial Year {plan.fiscal_year}</div>
              </div>
            </div>

            <div className="col-sm-4">
              <div className="card border-0 shadow-sm p-3 rounded-3 bg-white border-top border-4 border-success h-100">
                <div className="text-muted small fw-semibold text-uppercase">Demand Pipeline</div>
                <div className="h4 fw-bold my-1 font-monospace text-success">{formatINR(totalCommitted)}</div>
                <div className="text-muted" style={{ fontSize: '0.72rem' }}>{requisitions.length} active requisitions</div>
              </div>
            </div>
          </div>

          {/* Description */}
          <div className="card border-0 shadow-sm rounded-3 bg-white p-4 mb-4">
            <h6 className="fw-bold pb-2 mb-3 border-bottom text-uppercase small" style={{ color: '#102A43' }}>
              <i className="bi bi-file-earmark-text text-warning me-2"></i>Program Mandate &amp; Strategic Objectives
            </h6>
            <div className="text-secondary small lh-lg" style={{ whiteSpace: 'pre-wrap' }}>
              {plan.description || 'No detailed strategic objectives recorded for this procurement plan.'}
            </div>
          </div>

          {/* Linked Requisitions Table */}
          <div className="card border-0 shadow-sm rounded-3 bg-white p-4">
            <div className="d-flex justify-content-between align-items-center pb-2 mb-3 border-bottom">
              <div>
                <h6 className="fw-bold mb-0 text-uppercase small" style={{ color: '#102A43' }}>
                  <i className="bi bi-clipboard-check text-warning me-2"></i>Linked Procurement Requisitions
                  <span className="badge bg-secondary ms-2">{requisitions.length}</span>
                </h6>
              </div>
              <Link
                to={`/app/procurement/requisitions/new?plan=${plan.id}`}
                className="btn btn-sm btn-outline-primary d-flex align-items-center gap-1"
              >
                <i className="bi bi-plus-lg"></i>
                <span>Create Requisition</span>
              </Link>
            </div>

            {requisitions.length === 0 ? (
              <div className="text-center py-4 text-muted small">
                <i className="bi bi-inbox fs-2 d-block text-secondary mb-2"></i>
                No requisitions or demand indentures submitted under this procurement plan yet.
              </div>
            ) : (
              <div className="table-responsive">
                <table className="table table-sm table-hover align-middle mb-0" style={{ fontSize: '0.84rem' }}>
                  <thead className="table-light text-muted">
                    <tr>
                      <th>Requisition #</th>
                      <th>Title</th>
                      <th>Priority</th>
                      <th className="text-end">Estimated Value</th>
                      <th>Required By</th>
                      <th>Status</th>
                      <th className="text-end">Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {requisitions.map(req => (
                      <tr key={req.id}>
                        <td className="fw-semibold">
                          <Link to={`/app/procurement/requisitions/${req.id}`} className="font-monospace text-primary text-decoration-none">
                            {req.requisition_number}
                          </Link>
                        </td>
                        <td className="text-dark fw-medium text-truncate" style={{ maxWidth: '220px' }}>
                          <Link to={`/app/procurement/requisitions/${req.id}`} className="text-dark text-decoration-none">
                            {req.title}
                          </Link>
                        </td>
                        <td>
                          <PriorityBadge priority={req.priority} />
                        </td>
                        <td className="text-end font-monospace fw-semibold text-dark">
                          {formatINR(req.total_amount)}
                        </td>
                        <td className="text-muted">{formatDate(req.required_by_date)}</td>
                        <td>
                          <StatusBadge status={req.status} />
                        </td>
                        <td className="text-end">
                          <Link to={`/app/procurement/requisitions/${req.id}`} className="btn btn-sm btn-link text-primary p-0">
                            Details &rarr;
                          </Link>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>

        {/* Right Col: Budget Ceiling Progress & Metadata */}
        <div className="col-lg-4">
          {/* Budget Utilization Meter */}
          <div className="card border-0 shadow-sm rounded-3 bg-white p-3 mb-4">
            <h6 className="fw-bold mb-3 small text-uppercase border-bottom pb-2" style={{ color: '#102A43' }}>
              <i className="bi bi-pie-chart-fill text-warning me-2"></i>Budget Utilization
            </h6>

            <div className="d-flex justify-content-between small mb-1">
              <span className="text-muted">Demand Incurred:</span>
              <span className="fw-bold text-dark">{formatINR(totalCommitted)}</span>
            </div>
            <div className="d-flex justify-content-between small mb-2">
              <span className="text-muted">Total Sanctioned:</span>
              <span className="fw-bold text-dark">{formatINR(plan.total_budget)}</span>
            </div>

            {/* Progress Bar */}
            <div className="progress mb-2" style={{ height: '10px' }}>
              <div
                className={`progress-bar ${utilizationPct > 90 ? 'bg-danger' : utilizationPct > 70 ? 'bg-warning' : 'bg-success'}`}
                role="progressbar"
                style={{ width: `${utilizationPct}%` }}
                aria-valuenow={utilizationPct}
                aria-valuemin="0"
                aria-valuemax="100"
              ></div>
            </div>

            <div className="d-flex justify-content-between text-muted" style={{ fontSize: '0.72rem' }}>
              <span>{utilizationPct}% Committed</span>
              <span>{formatINR(Math.max(budget - totalCommitted, 0))} Remaining</span>
            </div>
          </div>

          {/* Audit Metadata */}
          <div className="card border-0 shadow-sm rounded-3 bg-white p-3 mb-4">
            <h6 className="fw-bold mb-3 small text-uppercase border-bottom pb-2" style={{ color: '#102A43' }}>
              <i className="bi bi-shield-check text-warning me-2"></i>Audit &amp; Governance
            </h6>

            <div className="d-flex flex-column gap-2 small">
              <div className="d-flex justify-content-between pb-1 border-bottom">
                <span className="text-muted">Sanctioning Officer</span>
                <span className="fw-semibold text-dark">{plan.created_by_name || 'System Admin'}</span>
              </div>
              <div className="d-flex justify-content-between pb-1 border-bottom">
                <span className="text-muted">Date Established</span>
                <span className="text-dark">{formatDateTime(plan.created_at)}</span>
              </div>
              <div className="d-flex justify-content-between pb-1">
                <span className="text-muted">Last Updated</span>
                <span className="text-dark">{formatDateTime(plan.updated_at)}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      <ConfirmDialog
        show={showDeleteModal}
        title="Permanently Delete Procurement Plan"
        message={`Are you certain you wish to delete procurement plan ${plan.plan_number} ("${plan.title}")? This action cannot be reversed.`}
        variant="danger"
        loading={deleteLoading}
        onConfirm={handleDeletePlan}
        onCancel={() => setShowDeleteModal(false)}
      />
    </div>
  )
}
