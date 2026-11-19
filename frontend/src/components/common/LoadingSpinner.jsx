export default function LoadingSpinner({ message = 'Loading...' }) {
  return (
    <div className="d-flex flex-column align-items-center justify-content-center" style={{ minHeight: '200px' }}>
      <div className="spinner-border" style={{ color: '#102A43' }} role="status">
        <span className="visually-hidden">Loading...</span>
      </div>
      <p className="mt-3 text-muted">{message}</p>
    </div>
  )
}
