import { useState } from 'react'

export default function ErrorAlert({ message, onDismiss }) {
  const [visible, setVisible] = useState(true)
  if (!visible || !message) return null
  return (
    <div className="alert alert-danger alert-dismissible" role="alert">
      <i className="bi bi-exclamation-triangle-fill me-2"></i>
      {message}
      <button type="button" className="btn-close" onClick={() => { setVisible(false); onDismiss?.() }} />
    </div>
  )
}
