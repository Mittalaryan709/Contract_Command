import { useState, useEffect, useCallback } from 'react'
import { useParams, Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext.jsx'
import { getContract, patchContract, deleteContract, createDocument, deleteDocument } from '../../api/contractApi.js'
import StatusBadge from '../../components/common/StatusBadge.jsx'
import LoadingSpinner from '../../components/common/LoadingSpinner.jsx'
import ConfirmDialog from '../../components/common/ConfirmDialog.jsx'
import { formatINR, formatDate, formatDateTime } from '../../utils/formatters.js'

export default function ContractDetailPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { canWrite, canDelete } = useAuth()

  const [contract, setContract] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [statusUpdating, setStatusUpdating] = useState(false)
  const [feedback, setFeedback] = useState('')

  // Delete Contract Modal
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [deleteLoading, setDeleteLoading] = useState(false)

  // Attach Document State
  const [showDocModal, setShowDocModal] = useState(false)
  const [docForm, setDocForm] = useState({ title: '', file_name: '', file_path: '' })
  const [docLoading, setDocLoading] = useState(false)
  const [docError, setDocError] = useState('')

  // Delete Document Modal
  const [deleteDocTarget, setDeleteDocTarget] = useState(null)
  const [deleteDocLoading, setDeleteDocLoading] = useState(false)

  const fetchContract = useCallback(async () => {
    setLoading(true)
    setError('')
    try {
      const res = await getContract(id)
      const data = res.data?.data ?? res.data
      setContract(data)
    } catch (err) {
      setError(err.response?.data?.message || 'Unable to retrieve contract details. It may not exist or access is restricted.')
    } finally {
      setLoading(false)
    }
  }, [id])

  useEffect(() => {
    fetchContract()
  }, [fetchContract])

  // Lifecycle status transition
  const handleStatusChange = async (newStatus) => {
    setStatusUpdating(true)
    setFeedback('')
    try {
      await patchContract(id, { status: newStatus })
      setFeedback(`Contract status transitioned to ${newStatus}.`)
      fetchContract()
    } catch (err) {
      setError(err.response?.data?.message || `Failed to transition status to ${newStatus}.`)
    } finally {
      setStatusUpdating(false)
    }
  }

  // Delete Contract
  const handleDeleteContract = async () => {
    setDeleteLoading(true)
    try {
      await deleteContract(id)
      navigate('/app/contracts')
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to delete contract. Administrator clearance required.')
      setShowDeleteModal(false)
    } finally {
      setDeleteLoading(false)
    }
  }

  // Attach Document
  const handleAttachDocument = async (e) => {
    e.preventDefault()
    if (!docForm.title.trim() || !docForm.file_name.trim() || !docForm.file_path.trim()) {
      setDocError('Please provide document title, filename, and storage path.')
      return
    }

    setDocLoading(true)
    setDocError('')
    try {
      await createDocument({
        contract: parseInt(id, 10),
        title: docForm.title.trim(),
        file_name: docForm.file_name.trim(),
        file_path: docForm.file_path.trim(),
      })
      setShowDocModal(false)
      setDocForm({ title: '', file_name: '', file_path: '' })
      setFeedback('Audit document attached successfully.')
      fetchContract()
    } catch (err) {
      setDocError(err.response?.data?.message || 'Failed to attach document.')
    } finally {
      setDocLoading(false)
    }
  }

  // Delete Document
  const handleDeleteDocConfirm = async () => {
    if (!deleteDocTarget) return
    setDeleteDocLoading(true)
    try {
      await deleteDocument(deleteDocTarget.id)
      setDeleteDocTarget(null)
      setFeedback('Document reference removed from contract repository.')
      fetchContract()
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to delete document reference.')
    } finally {
      setDeleteDocLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="p-5 text-center">
        <LoadingSpinner message="Decrypting &amp; Loading Contract Dossier..." />
      </div>
    )
  }

  if (error && !contract) {
    return (
      <div className="container-fluid p-0">
        <div className="alert alert-danger d-flex align-items-center gap-3 p-4 rounded-3 shadow-sm">
          <i className="bi bi-exclamation-triangle-fill fs-3 text-danger"></i>
          <div>
            <h5 className="alert-heading fw-bold mb-1">Contract Dossier Unavailable</h5>
            <p className="mb-2 small">{error}</p>
            <Link to="/app/contracts" className="btn btn-sm btn-outline-danger">
              <i className="bi bi-arrow-left me-1"></i>Return to Contracts
            </Link>
          </div>
        </div>
      </div>
    )
  }

  // Calculate validity duration in days
  const start = new Date(contract.start_date)
  const end = new Date(contract.end_date)
  const diffDays = Math.ceil((end - start) / (1000 * 60 * 60 * 24))

  return (
    <div className="container-fluid p-0">
      {/* Top Header & Navigation */}
      <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center gap-3 mb-4 pb-2 border-bottom">
        <div>
          <div className="d-flex align-items-center gap-2 mb-1 flex-wrap">
            <span className="font-monospace fw-bold px-2 py-1 bg-light border rounded text-primary" style={{ fontSize: '0.85rem' }}>
              {contract.contract_number}
            </span>
            <StatusBadge status={contract.status} />
            <span className="badge bg-secondary" style={{ fontSize: '0.72rem' }}>
              {contract.contract_type}
            </span>
          </div>
          <h4 className="fw-bold mb-0 text-dark">{contract.title}</h4>
        </div>

        {/* Action Buttons */}
        <div className="d-flex align-items-center gap-2 flex-wrap">
          <Link to="/app/contracts" className="btn btn-outline-secondary btn-sm">
            <i className="bi bi-arrow-left me-1"></i>Repository
          </Link>

          {canWrite() && (
            <Link to={`/app/contracts/${contract.id}/edit`} className="btn btn-outline-primary btn-sm">
              <i className="bi bi-pencil me-1"></i>Edit Contract
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

      {/* Feedback Alert */}
      {feedback && (
        <div className="alert alert-success alert-dismissible fade show d-flex align-items-center gap-2 small mb-4" role="alert">
          <i className="bi bi-check-circle-fill text-success"></i>
          <span className="flex-grow-1">{feedback}</span>
          <button type="button" className="btn-close" onClick={() => setFeedback('')}></button>
        </div>
      )}

      {/* Error Alert */}
      {error && (
        <div className="alert alert-danger alert-dismissible fade show d-flex align-items-center gap-2 small mb-4" role="alert">
          <i className="bi bi-exclamation-octagon-fill text-danger"></i>
          <span className="flex-grow-1">{error}</span>
          <button type="button" className="btn-close" onClick={() => setError('')}></button>
        </div>
      )}

      {/* Main Grid: Details + Vendor */}
      <div className="row g-4 mb-4">
        {/* Left Column: Financial & Schedule Dossier */}
        <div className="col-lg-8">
          {/* Key Metrics Strip */}
          <div className="row g-3 mb-4">
            <div className="col-sm-4">
              <div className="card border-0 shadow-sm p-3 rounded-3 bg-white border-top border-4 border-warning h-100">
                <div className="text-muted small fw-semibold text-uppercase">Contract Value</div>
                <div className="h4 fw-bold my-1 font-monospace text-dark">{formatINR(contract.value)}</div>
                <div className="text-muted" style={{ fontSize: '0.72rem' }}>Total authorized allocation</div>
              </div>
            </div>

            <div className="col-sm-4">
              <div className="card border-0 shadow-sm p-3 rounded-3 bg-white border-top border-4 border-primary h-100">
                <div className="text-muted small fw-semibold text-uppercase">Validity Period</div>
                <div className="fw-bold my-1 text-dark" style={{ fontSize: '0.9rem' }}>
                  {formatDate(contract.start_date)} &mdash; {formatDate(contract.end_date)}
                </div>
                <div className="text-muted" style={{ fontSize: '0.72rem' }}>{diffDays} calendar days duration</div>
              </div>
            </div>

            <div className="col-sm-4">
              <div className="card border-0 shadow-sm p-3 rounded-3 bg-white border-top border-4 border-success h-100">
                <div className="text-muted small fw-semibold text-uppercase">Audit Trail</div>
                <div className="fw-semibold my-1 text-dark" style={{ fontSize: '0.82rem' }}>
                  By: {contract.created_by_name || 'System'}
                </div>
                <div className="text-muted" style={{ fontSize: '0.72rem' }}>
                  Logged: {formatDateTime(contract.created_at)}
                </div>
              </div>
            </div>
          </div>

          {/* Scope and Technical Requirements */}
          <div className="card border-0 shadow-sm rounded-3 bg-white p-4 mb-4">
            <h6 className="fw-bold pb-2 mb-3 border-bottom text-uppercase small" style={{ color: '#102A43' }}>
              <i className="bi bi-file-text-fill text-warning me-2"></i>Scope of Supply &amp; Technical Specifications
            </h6>
            <div className="text-secondary small lh-lg" style={{ whiteSpace: 'pre-wrap' }}>
              {contract.description || 'No detailed scope notes or technical specifications recorded for this contract.'}
            </div>
          </div>

          {/* Attached Audit Documents */}
          <div className="card border-0 shadow-sm rounded-3 bg-white p-4">
            <div className="d-flex justify-content-between align-items-center pb-2 mb-3 border-bottom">
              <h6 className="fw-bold mb-0 text-uppercase small" style={{ color: '#102A43' }}>
                <i className="bi bi-paperclip text-warning me-2"></i>Contract Documents &amp; Amendments
                <span className="badge bg-secondary ms-2">{contract.documents?.length || 0}</span>
              </h6>
              {canWrite() && (
                <button
                  type="button"
                  className="btn btn-sm btn-outline-primary d-flex align-items-center gap-1"
                  onClick={() => setShowDocModal(true)}
                >
                  <i className="bi bi-plus-lg"></i>
                  <span>Attach Document</span>
                </button>
              )}
            </div>

            {(!contract.documents || contract.documents.length === 0) ? (
              <div className="text-center py-4 text-muted small">
                <i className="bi bi-folder2-open fs-2 d-block text-secondary mb-2"></i>
                No compliance documents, signed PDFs, or technical annexures attached yet.
              </div>
            ) : (
              <div className="table-responsive">
                <table className="table table-sm table-hover align-middle mb-0" style={{ fontSize: '0.82rem' }}>
                  <thead className="table-light text-muted">
                    <tr>
                      <th>Document Title</th>
                      <th>Filename</th>
                      <th>Storage Path</th>
                      <th>Uploaded By</th>
                      <th>Date</th>
                      {canDelete() && <th className="text-end">Action</th>}
                    </tr>
                  </thead>
                  <tbody>
                    {contract.documents.map(doc => (
                      <tr key={doc.id}>
                        <td className="fw-semibold text-dark">{doc.title}</td>
                        <td className="font-monospace text-primary">
                          <i className="bi bi-file-earmark-pdf me-1 text-danger"></i>
                          {doc.file_name}
                        </td>
                        <td className="font-monospace text-muted small text-truncate" style={{ maxWidth: '160px' }}>
                          {doc.file_path}
                        </td>
                        <td className="text-muted">{doc.uploaded_by_name || 'Authorized Staff'}</td>
                        <td className="text-muted">{formatDate(doc.uploaded_at?.split('T')[0])}</td>
                        {canDelete() && (
                          <td className="text-end">
                            <button
                              type="button"
                              className="btn btn-sm btn-link text-danger p-0"
                              title="Delete document attachment"
                              onClick={() => setDeleteDocTarget(doc)}
                            >
                              <i className="bi bi-trash"></i>
                            </button>
                          </td>
                        )}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>

        {/* Right Column: Vendor Card & Quick Transitions */}
        <div className="col-lg-4">
          {/* Quick Lifecycle Controls */}
          {canWrite() && (
            <div className="card border-0 shadow-sm rounded-3 bg-white p-3 mb-4">
              <h6 className="fw-bold mb-2 small text-uppercase" style={{ color: '#102A43' }}>
                <i className="bi bi-gear-fill text-warning me-2"></i>Lifecycle Actions
              </h6>
              <p className="text-muted small mb-3" style={{ fontSize: '0.75rem' }}>
                Transition contract status according to defence procurement workflows.
              </p>

              <div className="d-flex flex-column gap-2">
                {contract.status === 'Draft' && (
                  <button
                    type="button"
                    className="btn btn-sm btn-success d-flex align-items-center justify-content-center gap-2"
                    disabled={statusUpdating}
                    onClick={() => handleStatusChange('Active')}
                  >
                    <i className="bi bi-check-circle"></i>
                    <span>Execute / Mark Active</span>
                  </button>
                )}

                {contract.status === 'Active' && (
                  <>
                    <button
                      type="button"
                      className="btn btn-sm btn-outline-success d-flex align-items-center justify-content-center gap-2"
                      disabled={statusUpdating}
                      onClick={() => handleStatusChange('Completed')}
                    >
                      <i className="bi bi-check2-all"></i>
                      <span>Mark Contract Completed</span>
                    </button>
                    <button
                      type="button"
                      className="btn btn-sm btn-outline-danger d-flex align-items-center justify-content-center gap-2"
                      disabled={statusUpdating}
                      onClick={() => handleStatusChange('Terminated')}
                    >
                      <i className="bi bi-slash-circle"></i>
                      <span>Terminate Agreement</span>
                    </button>
                  </>
                )}

                {(contract.status === 'Terminated' || contract.status === 'Expired' || contract.status === 'Completed') && (
                  <button
                    type="button"
                    className="btn btn-sm btn-outline-secondary d-flex align-items-center justify-content-center gap-2"
                    disabled={statusUpdating}
                    onClick={() => handleStatusChange('Draft')}
                  >
                    <i className="bi bi-arrow-counterclockwise"></i>
                    <span>Reopen as Draft</span>
                  </button>
                )}
              </div>
            </div>
          )}

          {/* Prime Contractor Card */}
          <div className="card border-0 shadow-sm rounded-3 bg-white p-3 mb-4">
            <h6 className="fw-bold mb-3 small text-uppercase border-bottom pb-2" style={{ color: '#102A43' }}>
              <i className="bi bi-building-check text-warning me-2"></i>Prime Contractor Info
            </h6>

            {contract.vendor ? (
              <div>
                <div className="fw-bold text-dark mb-1" style={{ fontSize: '0.95rem' }}>
                  {contract.vendor_name}
                </div>
                <div className="text-muted small mb-3">
                  Registered Defence Industry Partner
                </div>

                <div className="d-flex flex-column gap-2 small">
                  <div className="d-flex justify-content-between pb-1 border-bottom">
                    <span className="text-muted">Vendor ID</span>
                    <span className="font-monospace text-dark">#{contract.vendor}</span>
                  </div>
                  <div className="d-flex justify-content-between pb-1 border-bottom">
                    <span className="text-muted">Performance Link</span>
                    <Link to={`/app/vendors/${contract.vendor}`} className="text-decoration-none">
                      Vendor Dossier &rarr;
                    </Link>
                  </div>
                </div>
              </div>
            ) : (
              <div className="text-muted small">
                <em>No external vendor linked to this internal requisition.</em>
              </div>
            )}
          </div>

          {/* DAP 2020 Compliance Notice */}
          <div className="card border-0 shadow-sm rounded-3 p-3 text-dark" style={{ backgroundColor: '#F3F6F9', borderLeft: '4px solid #102A43' }}>
            <div className="fw-bold small mb-1">
              <i className="bi bi-shield-lock-fill text-warning me-1"></i>Defence Audit Compliance
            </div>
            <p className="text-muted mb-0" style={{ fontSize: '0.74rem', lineHeight: '1.4' }}>
              This contract record is subject to Ministry of Defence internal audit, CVC anti-corruption scrutiny, and Controller General of Defence Accounts (CGDA) financial validation.
            </p>
          </div>
        </div>
      </div>

      {/* Attach Document Modal */}
      {showDocModal && (
        <div className="modal show d-block" style={{ backgroundColor: 'rgba(0,0,0,0.5)', zIndex: 1060 }}>
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content border-0 shadow-lg rounded-3">
              <div className="modal-header bg-light">
                <h6 className="modal-title fw-bold" style={{ color: '#102A43' }}>
                  <i className="bi bi-file-earmark-plus text-warning me-2"></i>Attach Contract Document
                </h6>
                <button
                  type="button"
                  className="btn-close"
                  onClick={() => setShowDocModal(false)}
                  disabled={docLoading}
                ></button>
              </div>

              <form onSubmit={handleAttachDocument}>
                <div className="modal-body p-4">
                  {docError && (
                    <div className="alert alert-danger small py-2 mb-3" role="alert">
                      {docError}
                    </div>
                  )}

                  <div className="mb-3">
                    <label className="form-label fw-semibold small">
                      Document Title <span className="text-danger">*</span>
                    </label>
                    <input
                      type="text"
                      className="form-control form-control-sm"
                      placeholder="e.g., Signed Master Supply Agreement"
                      value={docForm.title}
                      onChange={(e) => setDocForm(prev => ({ ...prev, title: e.target.value }))}
                      required
                    />
                  </div>

                  <div className="mb-3">
                    <label className="form-label fw-semibold small">
                      File Name <span className="text-danger">*</span>
                    </label>
                    <input
                      type="text"
                      className="form-control form-control-sm font-monospace"
                      placeholder="e.g., CC-2026-0001_Signed_Agreement.pdf"
                      value={docForm.file_name}
                      onChange={(e) => setDocForm(prev => ({ ...prev, file_name: e.target.value }))}
                      required
                    />
                  </div>

                  <div className="mb-3">
                    <label className="form-label fw-semibold small">
                      Storage URI / File Path <span className="text-danger">*</span>
                    </label>
                    <input
                      type="text"
                      className="form-control form-control-sm font-monospace"
                      placeholder="e.g., /secure/contracts/2026/CC-2026-0001_Signed.pdf"
                      value={docForm.file_path}
                      onChange={(e) => setDocForm(prev => ({ ...prev, file_path: e.target.value }))}
                      required
                    />
                    <small className="text-muted" style={{ fontSize: '0.7rem' }}>
                      Physical or cloud document archive repository path
                    </small>
                  </div>
                </div>

                <div className="modal-footer bg-light">
                  <button
                    type="button"
                    className="btn btn-sm btn-secondary"
                    onClick={() => setShowDocModal(false)}
                    disabled={docLoading}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="btn btn-sm btn-navy d-flex align-items-center gap-1"
                    disabled={docLoading}
                  >
                    {docLoading && <span className="spinner-border spinner-border-sm"></span>}
                    <span>Save Document Reference</span>
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Delete Contract Confirmation Modal */}
      <ConfirmDialog
        show={showDeleteModal}
        title="Permanently Delete Contract"
        message={`Are you certain you wish to delete contract ${contract.contract_number} ("${contract.title}")? All associated document references will also be removed. This requires Administrator clearance.`}
        variant="danger"
        loading={deleteLoading}
        onConfirm={handleDeleteContract}
        onCancel={() => setShowDeleteModal(false)}
      />

      {/* Delete Document Confirmation Modal */}
      <ConfirmDialog
        show={!!deleteDocTarget}
        title="Remove Document Reference"
        message={deleteDocTarget ? `Are you sure you want to remove document "${deleteDocTarget.title}" (${deleteDocTarget.file_name}) from this contract?` : ''}
        variant="danger"
        loading={deleteDocLoading}
        onConfirm={handleDeleteDocConfirm}
        onCancel={() => setDeleteDocTarget(null)}
      />
    </div>
  )
}
