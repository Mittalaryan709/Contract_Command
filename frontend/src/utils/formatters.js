export const formatINR = (amount) => {
  const num = parseFloat(amount) || 0
  return new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 2 }).format(num)
}

export const formatDate = (dateStr) => {
  if (!dateStr) return '—'
  const [y, m, d] = dateStr.split('-')
  return `${d}-${m}-${y}`
}

export const formatDateTime = (dtStr) => {
  if (!dtStr) return '—'
  const dt = new Date(dtStr)
  const d = String(dt.getDate()).padStart(2,'0')
  const m = String(dt.getMonth()+1).padStart(2,'0')
  const y = dt.getFullYear()
  const hh = String(dt.getHours()).padStart(2,'0')
  const mm = String(dt.getMinutes()).padStart(2,'0')
  return `${d}-${m}-${y} ${hh}:${mm}`
}

export const formatNumber = (n) =>
  new Intl.NumberFormat('en-IN').format(parseFloat(n) || 0)

export const truncate = (str, n = 50) =>
  str && str.length > n ? str.substring(0, n) + '…' : (str ?? '')

export const getStatusVariant = (status) => {
  const map = {
    Active: 'success', Approved: 'success', Completed: 'success', Paid: 'success', Selected: 'success',
    Draft: 'secondary', Pending: 'secondary', Initiated: 'secondary', Low: 'secondary',
    Expired: 'danger', Overdue: 'danger', Rejected: 'danger', Blacklisted: 'danger', Failed: 'danger',
    Terminated: 'warning', Cancelled: 'warning', Reversed: 'warning',
    Processing: 'info', Submitted: 'info', Shortlisted: 'info', Fulfilled: 'primary',
    High: 'warning', Urgent: 'danger', Medium: 'info',
    Inactive: 'secondary', Closed: 'secondary',
  }
  return map[status] ?? 'secondary'
}
