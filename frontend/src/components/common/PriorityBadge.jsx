export default function PriorityBadge({ priority }) {
  if (!priority) return null

  const getVariant = (p) => {
    switch (p) {
      case 'Urgent':
        return 'danger'
      case 'High':
        return 'warning text-dark'
      case 'Medium':
        return 'info text-dark'
      case 'Low':
      default:
        return 'secondary'
    }
  }

  return (
    <span className={`badge bg-${getVariant(priority)}`}>
      {priority}
    </span>
  )
}
