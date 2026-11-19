import api from './axiosInstance.js'

export const getDashboardStats = async () => {
  const [
    total, active, draft, plans, pendingReq, vendors, pendingInv, payments
  ] = await Promise.all([
    api.get('/api/contracts/', { params: { page_size: 1 } }),
    api.get('/api/contracts/', { params: { page_size: 1, status: 'Active' } }),
    api.get('/api/contracts/', { params: { page_size: 1, status: 'Draft' } }),
    api.get('/api/procurement/plans/', { params: { page_size: 1 } }),
    api.get('/api/procurement/requisitions/', { params: { page_size: 1, status: 'Pending' } }),
    api.get('/api/vendors/', { params: { page_size: 1 } }),
    api.get('/api/finance/invoices/', { params: { page_size: 1, status: 'Submitted' } }),
    api.get('/api/finance/payments/', { params: { page_size: 1, status: 'Completed' } }),
  ])
  const extract = (r) => r.data?.data?.count ?? r.data?.count ?? 0
  return {
    totalContracts: extract(total),
    activeContracts: extract(active),
    draftContracts: extract(draft),
    totalPlans: extract(plans),
    pendingRequisitions: extract(pendingReq),
    totalVendors: extract(vendors),
    pendingInvoices: extract(pendingInv),
    completedPayments: extract(payments),
  }
}

export const getRecentContracts = () =>
  api.get('/api/contracts/', { params: { page_size: 5, ordering: '-created_at' } })

export const getRecentRequisitions = () =>
  api.get('/api/procurement/requisitions/', { params: { page_size: 5, ordering: '-created_at' } })

export const getContractStatusDistribution = async () => {
  const statuses = ['Draft', 'Active', 'Expired', 'Terminated', 'Completed']
  const results = await Promise.all(
    statuses.map(s => api.get('/api/contracts/', { params: { page_size: 1, status: s } }))
  )
  const extract = (r) => r.data?.data?.count ?? 0
  return statuses.reduce((acc, s, i) => ({ ...acc, [s]: extract(results[i]) }), {})
}

export const getInvoiceStatusDistribution = async () => {
  const statuses = ['Draft', 'Submitted', 'Approved', 'Paid', 'Overdue']
  const results = await Promise.all(
    statuses.map(s => api.get('/api/finance/invoices/', { params: { page_size: 1, status: s } }))
  )
  const extract = (r) => r.data?.data?.count ?? 0
  return statuses.reduce((acc, s, i) => ({ ...acc, [s]: extract(results[i]) }), {})
}
