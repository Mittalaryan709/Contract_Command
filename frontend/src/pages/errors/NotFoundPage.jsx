import { Link } from 'react-router-dom'
export default function NotFoundPage() {
  return (
    <div className="d-flex flex-column align-items-center justify-content-center" style={{ minHeight: '100vh', background: '#F3F6F9' }}>
      <i className="bi bi-compass" style={{ fontSize: '4rem', color: '#102A43' }}></i>
      <h1 className="mt-3" style={{ color: '#102A43' }}>404 &mdash; Page Not Found</h1>
      <p className="text-muted">The page you are looking for does not exist.</p>
      <Link to="/" className="btn mt-3" style={{ background: '#102A43', color: '#fff' }}>Return to Home</Link>
    </div>
  )
}
