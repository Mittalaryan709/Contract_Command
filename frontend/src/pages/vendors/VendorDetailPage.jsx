import { useState, useEffect, useCallback } from 'react'
import { useParams, Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext.jsx'
import { getVendor, deleteVendor } from '../../api/vendorApi.js'
import StatusBadge from '../../components/common/StatusBadge.jsx'
import LoadingSpinner from '../../components/common/LoadingSpinner.jsx'
import ConfirmDialog from '../../components/common/ConfirmDialog.jsx'
import { formatDate } from '../../utils/formatters.js'

export default function VendorDetailPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { canWrite, canDelete } = useAuth()

  const [vendor, setVendor] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  // Delete modal
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [deleteLoading, setDeleteLoading] = useState(false)

  const fetchVendor = useCallback(async () => {
    setLoading(true)
    setError('')
    try {
      const res = await getVendor(id)
      const data = res.data?.data ?? res.data
      setVendor(data)
    } catch (err) {
      setError(err.response?.data?.message || 'Unable to retrieve vendor profile dossier.')
    } finally {
      setLoading(false)
    }
  }, [id])

  useEffect(() => {
    fetchVendor()
  }, [fetchVendor])

  const handleDeleteVendor = async () => {
    setDeleteLoading(true)
    try {
      await deleteVendor(id)
      navigate('/app/vendors')
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to delete vendor. Administrator clearance required.')
      setShowDeleteModal(false)
    } finally {
      setDeleteLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="p-5 text-center">
        <LoadingSpinner message="Retrieving Defence Supplier Dossier..." />
      </div>
    )
  }

  if (error && !vendor) {
    return (
      <div className="container-fluid p-0">
        <div className="alert alert-danger d-flex align-items-center gap-3 p-4 rounded-3 shadow-sm">
          <i className="bi bi-exclamation-triangle-fill fs-3 text-danger"></i>
          <div>
            <h5 className="alert-heading fw-bold mb-1">Supplier Dossier Unavailable</h5>
            <p className="mb-2 small">{error}</p>
            <Link to="/app/vendors" className="btn btn-sm btn-outline-danger">
              <i className="bi bi-arrow-left me-1"></i>Return to Directory
            </Link>
          </div>
        </div>
      </div>
    )
  }

  const evaluations = vendor.evaluations || []

  return (
    <div className="container-fluid p-0">
      {/* Header */}
      <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center gap-3 mb-4 pb-2 border-bottom">
        <div>
          <div className="d-flex align-items-center gap-2 mb-1 flex-wrap">
            <span className="font-monospace fw-bold px-2 py-1 bg-light border rounded text-primary" style={{ fontSize: '0.85rem' }}>
              {vendor.vendor_code}
            </span>
            <span className="badge bg-secondary" style={{ fontSize: '0.72rem' }}>
              {vendor.category}
            </span>
            <StatusBadge status={vendor.status} />
          </div>
          <h4 className="fw-bold mb-0 text-dark">{vendor.company_name}</h4>
        </div>

        {/* Action Controls */}
        <div className="d-flex align-items-center gap-2 flex-wrap">
          <Link to="/app/vendors" className="btn btn-outline-secondary btn-sm">
            <i className="bi bi-arrow-left me-1"></i>Directory
          </Link>

          <Link to={`/app/vendors/${vendor.id}/evaluate`} className="btn btn-outline-warning text-dark btn-sm d-flex align-items-center gap-1 shadow-sm">
            <i className="bi bi-award-fill text-warning"></i>
            <span>Evaluate Supplier</span>
          </Link>

          {canWrite() && (
            <Link to={`/app/vendors/${vendor.id}/edit`} className="btn btn-outline-primary btn-sm">
              <i className="bi bi-pencil me-1"></i>Edit Profile
            </Link>
          )}

          {canDelete() && (
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

      {/* Main Grid: Corporate Profile + 4-Pillar Scorecard */}
      <div className="row g-4 mb-4">
        {/* Left Col: Metric Strip & Performance Evaluations */}
        <div className="col-lg-8">
          {/* Key Metric Strip */}
          <div className="row g-3 mb-4">
            <div className="col-sm-4">
              <div className="card border-0 shadow-sm p-3 rounded-3 bg-white border-top border-4 border-warning h-100">
                <div className="text-muted small fw-semibold text-uppercase">4-Pillar Rating</div>
                <div className="h3 fw-bold my-1 text-dark">
                  {vendor.average_score !== null && vendor.average_score !== undefined ? (
                    <span className={parseFloat(vendor.average_score) >= 8.0 ? 'text-success' : 'text-warning'}>
                      {vendor.average_score} <small className="fs-6 text-muted">/ 10</small>
                    </span>
                  ) : (
                    <span className="text-muted fs-5">Unrated</span>
                  )}
                </div>
                <div className="text-muted" style={{ fontSize: '0.72rem' }}>Quality &bull; Delivery &bull; Price &bull; Compliance</div>
              </div>
            </div>

            <div className="col-sm-4">
              <div className="card border-0 shadow-sm p-3 rounded-3 bg-white border-top border-4 border-primary h-100">
                <div className="text-muted small fw-semibold text-uppercase">Contracts Awarded</div>
                <div className="h3 fw-bold my-1 text-primary">{vendor.contracts_count || 0}</div>
                <div className="text-muted" style={{ fontSize: '0.72rem' }}>Procurement agreements executed</div>
              </div>
            </div>

            <div className="col-sm-4">
              <div className="card border-0 shadow-sm p-3 rounded-3 bg-white border-top border-4 border-success h-100">
                <div className="text-muted small fw-semibold text-uppercase">Evaluation Audits</div>
                <div className="h3 fw-bold my-1 text-success">{evaluations.length}</div>
                <div className="text-muted" style={{ fontSize: '0.72rem' }}>Formal review scorecards</div>
              </div>
            </div>
          </div>

          {/* Evaluations History Card */}
          <div className="card border-0 shadow-sm rounded-3 bg-white p-4">
            <div className="d-flex justify-content-between align-items-center pb-2 mb-3 border-bottom">
              <div>
                <h6 className="fw-bold mb-0 text-uppercase small" style={{ color: '#102A43' }}>
                  <i className="bi bi-star-fill text-warning me-2"></i>DAP 2020 4-Pillar Evaluation History
                  <span className="badge bg-secondary ms-2">{evaluations.length}</span>
                </h6>
              </div>
              <Link
                to={`/app/vendors/${vendor.id}/evaluate`}
                className="btn btn-sm btn-outline-warning text-dark d-flex align-items-center gap-1"
              >
                <i className="bi bi-plus-lg"></i>
                <span>Score Supplier</span>
              </Link>
            </div>

            {evaluations.length === 0 ? (
              <div className="text-center py-4 text-muted small">
                <i className="bi bi-clipboard-x fs-2 d-block text-secondary mb-2"></i>
                No performance evaluations or safety audit scorecards logged for this supplier yet.
              </div>
            ) : (
              <div className="table-responsive">
                <table className="table table-sm table-hover align-middle mb-0" style={{ fontSize: '0.84rem' }}>
                  <thead className="table-light text-muted">
                    <tr>
                      <th>Date</th>
                      <th>Evaluator</th>
                      <th className="text-center">Quality</th>
                      <th className="text-center">Delivery</th>
                      <th className="text-center">Pricing</th>
                      <th className="text-center">Compliance</th>
                      <th className="text-center">Overall</th>
                      <th>Recommendation</th>
                      <th>Audit Remarks</th>
                    </tr>
                  </thead>
                  <tbody>
                    {evaluations.map(ev => (
                      <tr key={ev.id}>
                        <td className="text-dark fw-medium">{formatDate(ev.evaluation_date)}</td>
                        <td className="text-muted small">{ev.evaluated_by_name || 'Auditor'}</td>
                        <td className="text-center font-monospace">{ev.quality_score}</td>
                        <td className="text-center font-monospace">{ev.delivery_score}</td>
                        <td className="text-center font-monospace">{ev.pricing_score}</td>
                        <td className="text-center font-monospace">{ev.compliance_score}</td>
                        <td className="text-center font-monospace fw-bold text-dark">{ev.overall_score}/10</td>
                        <td>
                          <span
                            className={`badge ${ev.recommendation === 'Selected' ? 'bg-success' : ev.recommendation === 'Shortlisted' ? 'bg-warning text-dark' : 'bg-danger'}`}
                          >
                            {ev.recommendation}
                          </span>
                        </td>
                        <td className="text-muted small text-truncate" style={{ maxWidth: '200px' }}>
                          {ev.remarks || '—'}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>

        {/* Right Col: Corporate Dossier & Tax Credentials */}
        <div className="col-lg-4">
          {/* Corporate Profile Card */}
          <div className="card border-0 shadow-sm rounded-3 bg-white p-3 mb-4">
            <h6 className="fw-bold mb-3 small text-uppercase border-bottom pb-2" style={{ color: '#102A43' }}>
              <i className="bi bi-person-lines-fill text-warning me-2"></i>Official Communications
            </h6>

            <div className="d-flex flex-column gap-2 small">
              <div className="d-flex justify-content-between pb-1 border-bottom">
                <span className="text-muted">Contact Officer</span>
                <span className="fw-semibold text-dark">{vendor.contact_person}</span>
              </div>
              <div className="d-flex justify-content-between pb-1 border-bottom">
                <span className="text-muted">Email</span>
                <span className="text-primary">{vendor.email}</span>
              </div>
              <div className="d-flex justify-content-between pb-1 border-bottom">
                <span className="text-muted">Phone</span>
                <span className="font-monospace text-dark">{vendor.phone}</span>
              </div>
              <div className="d-flex justify-content-between pb-1 border-bottom">
                <span className="text-muted">Works Location</span>
                <span className="text-dark">{vendor.city}, {vendor.state}</span>
              </div>
              <div className="d-flex justify-content-between pb-1 border-bottom">
                <span className="text-muted">PIN Code</span>
                <span className="font-monospace text-dark">{vendor.pincode || '—'}</span>
              </div>
              {vendor.address && (
                <div className="pt-1">
                  <span className="text-muted d-block mb-1">Corporate Address:</span>
                  <div className="text-dark" style={{ fontSize: '0.78rem' }}>{vendor.address}</div>
                </div>
              )}
            </div>
          </div>

          {/* Statutory Tax Compliance Card */}
          <div className="card border-0 shadow-sm rounded-3 bg-white p-3 mb-4">
            <h6 className="fw-bold mb-3 small text-uppercase border-bottom pb-2" style={{ color: '#102A43' }}>
              <i className="bi bi-shield-check text-warning me-2"></i>Statutory Taxation
            </h6>

            <div className="d-flex flex-column gap-2 small">
              <div className="d-flex justify-content-between pb-1 border-bottom">
                <span className="text-muted">GSTIN</span>
                <span className="font-monospace fw-semibold text-dark">
                  {vendor.gst_number || 'NOT REGISTERED'}
                </span>
              </div>
              <div className="d-flex justify-content-between pb-1 border-bottom">
                <span className="text-muted">PAN Number</span>
                <span className="font-monospace fw-semibold text-dark">
                  {vendor.pan_number || 'NOT REGISTERED'}
                </span>
              </div>
              <div className="d-flex justify-content-between pb-1">
                <span className="text-muted">Registration Status</span>
                <span><StatusBadge status={vendor.status} /></span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      <ConfirmDialog
        show={showDeleteModal}
        title="Permanently Delete Supplier"
        message={`Are you certain you wish to delete supplier ${vendor.company_name} (${vendor.vendor_code})? This requires Administrator clearance and cannot be undone.`}
        variant="danger"
        loading={deleteLoading}
        onConfirm={handleDeleteVendor}
        onCancel={() => setShowDeleteModal(false)}
      />
    </div>
  )
}
