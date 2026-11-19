import api from './axiosInstance.js'

export const getInvoices = (params = {}) => api.get('/api/finance/invoices/', { params })
export const getInvoice = (id) => api.get(`/api/finance/invoices/${id}/`)
export const createInvoice = (data) => api.post('/api/finance/invoices/', data)
export const updateInvoice = (id, data) => api.put(`/api/finance/invoices/${id}/`, data)
export const deleteInvoice = (id) => api.delete(`/api/finance/invoices/${id}/`)

export const getInvoiceItems = (invoiceId) => api.get('/api/finance/invoices/items/', { params: { invoice: invoiceId } })
export const createInvoiceItem = (data) => api.post('/api/finance/invoices/items/', data)
export const deleteInvoiceItem = (id) => api.delete(`/api/finance/invoices/items/${id}/`)

export const getPayments = (params = {}) => api.get('/api/finance/payments/', { params })
export const getPayment = (id) => api.get(`/api/finance/payments/${id}/`)
export const createPayment = (data) => api.post('/api/finance/payments/', data)
export const updatePayment = (id, data) => api.put(`/api/finance/payments/${id}/`, data)
