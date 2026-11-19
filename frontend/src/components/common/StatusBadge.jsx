import { getStatusVariant } from '../../utils/formatters.js'

export default function StatusBadge({ status }) {
  if (!status) return null
  return (
    <span className={`badge bg-${getStatusVariant(status)}`}>{status}</span>
  )
}
