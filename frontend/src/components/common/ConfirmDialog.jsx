export default function ConfirmDialog({ show, title, message, onConfirm, onCancel, variant = 'danger', loading = false }) {
  if (!show) return null
  return (
    <div className="modal show d-block" style={{ background: 'rgba(0,0,0,0.5)' }}>
      <div className="modal-dialog">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title">{title}</h5>
            <button className="btn-close" onClick={onCancel} />
          </div>
          <div className="modal-body">{message}</div>
          <div className="modal-footer">
            <button className="btn btn-secondary" onClick={onCancel} disabled={loading}>Cancel</button>
            <button className={`btn btn-${variant}`} onClick={onConfirm} disabled={loading}>
              {loading ? <span className="spinner-border spinner-border-sm me-2" /> : null}
              Confirm
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
