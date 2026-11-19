import api from './axiosInstance.js'

export const getContracts = (params = {}) => api.get('/api/contracts/', { params })
export const getContract = (id) => api.get(`/api/contracts/${id}/`)
export const createContract = (data) => api.post('/api/contracts/', data)
export const updateContract = (id, data) => api.put(`/api/contracts/${id}/`, data)
export const patchContract = (id, data) => api.patch(`/api/contracts/${id}/`, data)
export const deleteContract = (id) => api.delete(`/api/contracts/${id}/`)
export const getDocuments = (contractId) => api.get('/api/contracts/documents/', { params: { contract: contractId } })
export const createDocument = (data) => api.post('/api/contracts/documents/', data)
export const deleteDocument = (id) => api.delete(`/api/contracts/documents/${id}/`)
