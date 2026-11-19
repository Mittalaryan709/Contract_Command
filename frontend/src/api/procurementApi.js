import api from './axiosInstance.js'

export const getPlans = (params = {}) => api.get('/api/procurement/plans/', { params })
export const getPlan = (id) => api.get(`/api/procurement/plans/${id}/`)
export const createPlan = (data) => api.post('/api/procurement/plans/', data)
export const updatePlan = (id, data) => api.put(`/api/procurement/plans/${id}/`, data)
export const deletePlan = (id) => api.delete(`/api/procurement/plans/${id}/`)

export const getRequisitions = (params = {}) => api.get('/api/procurement/requisitions/', { params })
export const getRequisition = (id) => api.get(`/api/procurement/requisitions/${id}/`)
export const createRequisition = (data) => api.post('/api/procurement/requisitions/', data)
export const updateRequisition = (id, data) => api.put(`/api/procurement/requisitions/${id}/`, data)
export const approveRequisition = (id) => api.post(`/api/procurement/requisitions/${id}/approve/`)
export const rejectRequisition = (id) => api.post(`/api/procurement/requisitions/${id}/reject/`)

export const getItems = (requisitionId) => api.get('/api/procurement/requisitions/items/', { params: { requisition: requisitionId } })
export const createItem = (data) => api.post('/api/procurement/requisitions/items/', data)
export const updateItem = (id, data) => api.put(`/api/procurement/requisitions/items/${id}/`, data)
export const deleteItem = (id) => api.delete(`/api/procurement/requisitions/items/${id}/`)
