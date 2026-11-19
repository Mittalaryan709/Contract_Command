export default function EmptyState({ icon = 'bi-inbox', title = 'No records found', subtitle = '', action }) {
  return (
    <div className="text-center py-5">
      <i className={`bi ${icon} fs-1 text-muted`}></i>
      <h5 className="mt-3 text-muted">{title}</h5>
      {subtitle && <p className="text-muted small">{subtitle}</p>}
      {action && <div className="mt-3">{action}</div>}
    </div>
  )
}
