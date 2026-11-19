import { useState, useEffect, useCallback } from 'react'
import { useParams, Link } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext.jsx'
import {
  getRequisition,
  approveRequisition,
  rejectRequisition,
  createItem,
  deleteItem,
} from '../../api/procurementApi.js'
import StatusBadge from '../../components/common/StatusBadge.jsx'
import PriorityBadge from '../../components/common/PriorityBadge.jsx'
import LoadingSpinner from '../../components/common/LoadingSpinner.jsx'
import ConfirmDialog from '../../components/common/ConfirmDialog.jsx'
import { formatINR, formatDate, formatDateTime } from '../../utils/formatters.js'

export default function RequisitionDetailPage() {
  const { id } = useParams()
  const { canWrite } = useAuth()

  const [requisition, setRequisition] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [feedback, setFeedback] = useState('')
  const [actionLoading, setActionLoading] = useState(false)

  // Add Item Modal state
  const [showItemModal, setShowItemModal] = useState(false)
  const [itemForm, setItemForm] = useState({
    item_name: '',
    description: '',
    quantity: '1',
    unit: 'Unit',
    unit_price: '',
  })
  const [itemLoading, setItemLoading] = useState(false)
  const [itemError, setItemError] = useState('')

  // Delete Item Modal state
  const [deleteItemTarget, setDeleteItemTarget] = useState(null)
  const [deleteItemLoading, setDeleteItemLoading] = useState(false)

  const fetchRequisition = useCallback(async () => {
    setLoading(true)
    setError('')
    try {
      const res = await getRequisition(id)
      const data = res.data?.data ?? res.data
      setRequisition(data)
    } catch (err) {
      setError(err.response?.data?.message || 'Unable to retrieve requisition indenture dossier.')
    } finally {
      setLoading(false)
    }
  }, [id])

  useEffect(() => {
    fetchRequisition()
  }, [fetchRequisition])

  const handleApprove = async () => {
    setActionLoading(true)
    setFeedback('')
    try {
      await approveRequisition(id)
      setFeedback('Requisition approved successfully by Contracts Authority.')
      fetchRequisition()
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to approve requisition.')
    } finally {
      setActionLoading(false)
    }
  }

  const handleReject = async () => {
    setActionLoading(true)
    setFeedback('')
    try {
      await rejectRequisition(id)
      setFeedback('Requisition marked as Rejected.')
      fetchRequisition()
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to reject requisition.')
    } finally {
      setActionLoading(false)
    }
  }

  const handleAddItem = async (e) => {
    e.preventDefault()
    if (!itemForm.item_name.trim() || !itemForm.quantity || !itemForm.unit_price) {
      setItemError('Item name, quantity, and unit price are required.')
      return
    }

    setItemLoading(true)
    setItemError('')
    try {
      await createItem({
        requisition: parseInt(id, 10),
        item_name: itemForm.item_name.trim(),
        description: itemForm.description.trim(),
        quantity: parseFloat(itemForm.quantity),
        unit: itemForm.unit,
        unit_price: parseFloat(itemForm.unit_price),
      })
      setShowItemModal(false)
      setItemForm({ item_name: '', description: '', quantity: '1', unit: 'Unit', unit_price: '' })
      setFeedback('Line item added to requisition.')
      fetchRequisition()
    } catch (err) {
      setItemError(err.response?.data?.message || 'Failed to add line item.')
    } finally {
      setItemLoading(false)
    }
  }

  const handleDeleteItemConfirm = async () => {
    if (!deleteItemTarget) return
    setDeleteItemLoading(true)
    try {
      await deleteItem(deleteItemTarget.id)
      setDeleteItemTarget(null)
      setFeedback('Line item removed from requisition bill of quantities.')
      fetchRequisition()
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to delete line item.')
    } finally {
      setDeleteItemLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="p-5 text-center">
        <LoadingSpinner message="Retrieving Requisition Indenture Dossier..." />
      </div>
    )
  }

  if (error && !requisition) {
    return (
      <div className="container-fluid p-0">
        <div className="alert alert-danger d-flex align-items-center gap-3 p-4 rounded-3 shadow-sm">
          <i className="bi bi-exclamation-triangle-fill fs-3 text-danger"></i>
          <div>
            <h5 className="alert-heading fw-bold mb-1">Requisition Indenture Unavailable</h5>
            <p className="mb-2 small">{error}</p>
            <Link to="/app/procurement/requisitions" className="btn btn-sm btn-outline-danger">
              <i className="bi bi-arrow-left me-1"></i>Return to Requisitions
            </Link>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="container-fluid p-0">
      {/* Top Header */}
      <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center gap-3 mb-4 pb-2 border-bottom">
        <div>
          <div className="d-flex align-items-center gap-2 mb-1 flex-wrap">
            <span className="font-monospace fw-bold px-2 py-1 bg-light border rounded text-primary" style={{ fontSize: '0.85rem' }}>
              {requisition.requisition_number}
            </span>
            <PriorityBadge priority={requisition.priority} />
            <StatusBadge status={requisition.status} />
          </div>
          <h4 className="fw-bold mb-0 text-dark">{requisition.title}</h4>
        </div>

        {/* Action Controls */}
        <div className="d-flex align-items-center gap-2 flex-wrap">
          <Link to="/app/procurement/requisitions" className="btn btn-outline-secondary btn-sm">
            <i className="bi bi-arrow-left me-1"></i>Requisitions
          </Link>

          {/* Quick Approve / Reject for Contracts Managers & Admins */}
          {canWrite() && requisition.status === 'Pending' && (
            <>
              <button
                type="button"
                className="btn btn-success btn-sm d-flex align-items-center gap-1 shadow-sm"
                disabled={actionLoading}
                onClick={handleApprove}
              >
                {actionLoading ? <span className="spinner-border spinner-border-sm"></span> : <i className="bi bi-check-lg"></i>}
                <span>Approve Demand</span>
              </button>
              <button
                type="button"
                className="btn btn-outline-danger btn-sm d-flex align-items-center gap-1"
                disabled={actionLoading}
                onClick={handleReject}
              >
                <i className="bi bi-x-lg"></i>
                <span>Reject</span>
              </button>
            </>
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

      {/* Main Grid: Details + Items */}
      <div className="row g-4 mb-4">
        {/* Left Col: Scope and Items */}
        <div className="col-lg-8">
          {/* Key Metrics Cards */}
          <div className="row g-3 mb-4">
            <div className="col-sm-4">
              <div className="card border-0 shadow-sm p-3 rounded-3 bg-white border-top border-4 border-warning h-100">
                <div className="text-muted small fw-semibold text-uppercase">Total Estimated Value</div>
                <div className="h4 fw-bold my-1 font-monospace text-dark">{formatINR(requisition.total_amount)}</div>
                <div className="text-muted" style={{ fontSize: '0.72rem' }}>Calculated from bill of quantities</div>
              </div>
            </div>

            <div className="col-sm-4">
              <div className="card border-0 shadow-sm p-3 rounded-3 bg-white border-top border-4 border-primary h-100">
                <div className="text-muted small fw-semibold text-uppercase">Required Delivery Date</div>
                <div className="fw-bold my-1 text-dark" style={{ fontSize: '0.95rem' }}>
                  {formatDate(requisition.required_by_date)}
                </div>
                <div className="text-muted" style={{ fontSize: '0.72rem' }}>Priority: {requisition.priority}</div>
              </div>
            </div>

            <div className="col-sm-4">
              <div className="card border-0 shadow-sm p-3 rounded-3 bg-white border-top border-4 border-success h-100">
                <div className="text-muted small fw-semibold text-uppercase">Demanding Officer</div>
                <div className="fw-semibold my-1 text-dark" style={{ fontSize: '0.85rem' }}>
                  {requisition.requested_by_name || 'Authorized Staff'}
                </div>
                <div className="text-muted" style={{ fontSize: '0.72rem' }}>
                  Submitted: {formatDateTime(requisition.created_at)}
                </div>
              </div>
            </div>
          </div>

          {/* Description & Justification */}
          <div className="card border-0 shadow-sm rounded-3 bg-white p-4 mb-4">
            <h6 className="fw-bold pb-2 mb-3 border-bottom text-uppercase small" style={{ color: '#102A43' }}>
              <i className="bi bi-file-text-fill text-warning me-2"></i>Indenture Purpose &amp; Operational Justification
            </h6>
            <div className="text-secondary small lh-lg" style={{ whiteSpace: 'pre-wrap' }}>
              {requisition.description || 'No operational justification notes provided for this requisition.'}
            </div>
          </div>

          {/* Bill of Quantities / Line Items */}
          <div className="card border-0 shadow-sm rounded-3 bg-white p-4">
            <div className="d-flex justify-content-between align-items-center pb-2 mb-3 border-bottom">
              <div>
                <h6 className="fw-bold mb-0 text-uppercase small" style={{ color: '#102A43' }}>
                  <i className="bi bi-list-ol text-warning me-2"></i>Bill of Quantities &bull; Requisition Line Items
                  <span className="badge bg-secondary ms-2">{requisition.items?.length || 0}</span>
                </h6>
              </div>
              {requisition.status === 'Pending' && canWrite() && (
                <button
                  type="button"
                  className="btn btn-sm btn-outline-primary d-flex align-items-center gap-1"
                  onClick={() => setShowItemModal(true)}
                >
                  <i className="bi bi-plus-lg"></i>
                  <span>Add Line Item</span>
                </button>
              )}
            </div>

            {(!requisition.items || requisition.items.length === 0) ? (
              <div className="text-center py-4 text-muted small">
                <i className="bi bi-inbox fs-2 d-block text-secondary mb-2"></i>
                No line items added to this requisition yet.
              </div>
            ) : (
              <div className="table-responsive">
                <table className="table table-sm table-hover align-middle mb-0" style={{ fontSize: '0.84rem' }}>
                  <thead className="table-light text-muted">
                    <tr>
                      <th>#</th>
                      <th>Item Nomenclature &bull; Specs</th>
                      <th className="text-center">Quantity</th>
                      <th>Unit</th>
                      <th className="text-end">Unit Price (INR)</th>
                      <th className="text-end">Total Price (INR)</th>
                      {requisition.status === 'Pending' && canWrite() && <th className="text-center">Action</th>}
                    </tr>
                  </thead>
                  <tbody>
                    {requisition.items.map((it, idx) => (
                      <tr key={it.id}>
                        <td className="text-muted small">{idx + 1}</td>
                        <td>
                          <div className="fw-semibold text-dark">{it.item_name}</div>
                          {it.description && <div className="text-muted small">{it.description}</div>}
                        </td>
                        <td className="text-center font-monospace">{it.quantity}</td>
                        <td><span className="badge bg-light text-dark border">{it.unit}</span></td>
                        <td className="text-end font-monospace">{formatINR(it.unit_price)}</td>
                        <td className="text-end font-monospace fw-semibold text-dark">{formatINR(it.total_price)}</td>
                        {requisition.status === 'Pending' && canWrite() && (
                          <td className="text-center">
                            <button
                              type="button"
                              className="btn btn-sm btn-link text-danger p-0"
                              title="Delete line item"
                              onClick={() => setDeleteItemTarget(it)}
                            >
                              <i className="bi bi-trash"></i>
                            </button>
                          </td>
                        )}
                      </tr>
                    ))}
                  </tbody>
                  <tfoot>
                    <tr className="table-light">
                      <td colSpan="5" className="text-end fw-bold text-uppercase small" style={{ color: '#102A43' }}>
                        Total Indenture Valuation:
                      </td>
                      <td className="text-end font-monospace fw-bold h6 mb-0 text-success">
                        {formatINR(requisition.total_amount)}
                      </td>
                      {requisition.status === 'Pending' && canWrite() && <td></td>}
                    </tr>
                  </tfoot>
                </table>
              </div>
            )}
          </div>
        </div>

        {/* Right Col: Plan Info & Approval Authority Trail */}
        <div className="col-lg-4">
          {/* Associated Procurement Plan */}
          <div className="card border-0 shadow-sm rounded-3 bg-white p-3 mb-4">
            <h6 className="fw-bold mb-3 small text-uppercase border-bottom pb-2" style={{ color: '#102A43' }}>
              <i className="bi bi-calendar3 text-warning me-2"></i>Funding Master Plan
            </h6>
            <div className="fw-bold text-dark mb-1">
              {requisition.plan_title || `Procurement Plan #${requisition.plan}`}
            </div>
            <div className="text-muted small mb-3">
              Allocated fiscal program ceiling
            </div>
            <Link to={`/app/procurement/plans/${requisition.plan}`} className="btn btn-outline-primary btn-sm w-100">
              View Plan Details &rarr;
            </Link>
          </div>

          {/* Audit & Approval Authorization Trail */}
          <div className="card border-0 shadow-sm rounded-3 bg-white p-3 mb-4">
            <h6 className="fw-bold mb-3 small text-uppercase border-bottom pb-2" style={{ color: '#102A43' }}>
              <i className="bi bi-shield-lock-fill text-warning me-2"></i>Authorization Audit Trail
            </h6>

            <div className="d-flex flex-column gap-2 small">
              <div className="d-flex justify-content-between pb-1 border-bottom">
                <span className="text-muted">Status</span>
                <span><StatusBadge status={requisition.status} /></span>
              </div>
              <div className="d-flex justify-content-between pb-1 border-bottom">
                <span className="text-muted">Demanding Staff</span>
                <span className="fw-semibold text-dark">{requisition.requested_by_name || 'Staff Officer'}</span>
              </div>
              <div className="d-flex justify-content-between pb-1 border-bottom">
                <span className="text-muted">Date Lodged</span>
                <span className="text-dark">{formatDateTime(requisition.created_at)}</span>
              </div>

              {requisition.approved_by_name && (
                <>
                  <div className="d-flex justify-content-between pb-1 border-bottom">
                    <span className="text-muted">Cleared By</span>
                    <span className="fw-bold text-success">{requisition.approved_by_name}</span>
                  </div>
                  <div className="d-flex justify-content-between pb-1">
                    <span className="text-muted">Cleared At</span>
                    <span className="text-dark">{formatDateTime(requisition.approved_at)}</span>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Add Line Item Modal */}
      {showItemModal && (
        <div className="modal show d-block" style={{ backgroundColor: 'rgba(0,0,0,0.5)', zIndex: 1060 }}>
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content border-0 shadow-lg rounded-3">
              <div className="modal-header bg-light">
                <h6 className="modal-title fw-bold" style={{ color: '#102A43' }}>
                  <i className="bi bi-plus-circle text-warning me-2"></i>Add Requisition Line Item
                </h6>
                <button
                  type="button"
                  className="btn-close"
                  onClick={() => setShowItemModal(false)}
                  disabled={itemLoading}
                ></button>
              </div>

              <form onSubmit={handleAddItem}>
                <div className="modal-body p-4">
                  {itemError && (
                    <div className="alert alert-danger small py-2 mb-3" role="alert">
                      {itemError}
                    </div>
                  )}

                  <div className="mb-3">
                    <label className="form-label fw-semibold small">
                      Item Nomenclature / Name <span className="text-danger">*</span>
                    </label>
                    <input
                      type="text"
                      className="form-control form-control-sm"
                      placeholder="e.g. VHF/UHF Handheld Transceiver"
                      value={itemForm.item_name}
                      onChange={(e) => setItemForm(prev => ({ ...prev, item_name: e.target.value }))}
                      required
                    />
                  </div>

                  <div className="mb-3">
                    <label className="form-label fw-semibold small">Description / Part Spec</label>
                    <input
                      type="text"
                      className="form-control form-control-sm"
                      placeholder="e.g. Military Standard 810G, IP68 Waterproof"
                      value={itemForm.description}
                      onChange={(e) => setItemForm(prev => ({ ...prev, description: e.target.value }))}
                    />
                  </div>

                  <div className="row g-2 mb-3">
                    <div className="col-4">
                      <label className="form-label fw-semibold small">
                        Quantity <span className="text-danger">*</span>
                      </label>
                      <input
                        type="number"
                        step="0.01"
                        min="0.01"
                        className="form-control form-control-sm"
                        value={itemForm.quantity}
                        onChange={(e) => setItemForm(prev => ({ ...prev, quantity: e.target.value }))}
                        required
                      />
                    </div>

                    <div className="col-4">
                      <label className="form-label fw-semibold small">Unit</label>
                      <select
                        className="form-select form-select-sm"
                        value={itemForm.unit}
                        onChange={(e) => setItemForm(prev => ({ ...prev, unit: e.target.value }))}
                      >
                        <option value="Unit">Unit</option>
                        <option value="Set">Set</option>
                        <option value="Piece">Piece</option>
                        <option value="Box">Box</option>
                        <option value="Kg">Kg</option>
                        <option value="Litre">Litre</option>
                        <option value="Metre">Metre</option>
                        <option value="Hour">Hour</option>
                      </select>
                    </div>

                    <div className="col-4">
                      <label className="form-label fw-semibold small">
                        Unit Price (&#8377;) <span className="text-danger">*</span>
                      </label>
                      <input
                        type="number"
                        step="0.01"
                        min="0.01"
                        className="form-control form-control-sm font-monospace"
                        placeholder="0.00"
                        value={itemForm.unit_price}
                        onChange={(e) => setItemForm(prev => ({ ...prev, unit_price: e.target.value }))}
                        required
                      />
                    </div>
                  </div>
                </div>

                <div className="modal-footer bg-light">
                  <button
                    type="button"
                    className="btn btn-sm btn-secondary"
                    onClick={() => setShowItemModal(false)}
                    disabled={itemLoading}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="btn btn-sm btn-navy d-flex align-items-center gap-1"
                    disabled={itemLoading}
                  >
                    {itemLoading && <span className="spinner-border spinner-border-sm"></span>}
                    <span>Save Line Item</span>
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Delete Item Confirmation Modal */}
      <ConfirmDialog
        show={!!deleteItemTarget}
        title="Remove Line Item"
        message={deleteItemTarget ? `Are you sure you want to remove item "${deleteItemTarget.item_name}" from this requisition bill of quantities?` : ''}
        variant="danger"
        loading={deleteItemLoading}
        onConfirm={handleDeleteItemConfirm}
        onCancel={() => setDeleteItemTarget(null)}
      />
    </div>
  )
}
