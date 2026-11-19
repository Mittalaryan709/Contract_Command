import api from './axiosInstance.js'

export const getVendors = (params = {}) => api.get('/api/vendors/', { params })
export const getVendor = (id) => api.get(`/api/vendors/${id}/`)
export const createVendor = (data) => api.post('/api/vendors/', data)
export const updateVendor = (id, data) => api.put(`/api/vendors/${id}/`, data)
export const deleteVendor = (id) => api.delete(`/api/vendors/${id}/`)

export const getEvaluations = (params = {}) => api.get('/api/vendors/evaluations/', { params })
export const getEvaluation = (id) => api.get(`/api/vendors/evaluations/${id}/`)
export const createEvaluation = (data) => api.post('/api/vendors/evaluations/', data)
export const updateEvaluation = (id, data) => api.put(`/api/vendors/evaluations/${id}/`, data)
export const deleteEvaluation = (id) => api.delete(`/api/vendors/evaluations/${id}/`)
